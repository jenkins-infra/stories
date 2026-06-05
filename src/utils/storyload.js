import { remark } from 'remark';
import html from 'remark-html';

const storyFiles = import.meta.glob('../user-story/**/index.yaml', {
  query: '?raw',
  import: 'default',
});

const allImages = import.meta.glob(
  '../user-story/**/*.{png,jpg,jpeg,webp,svg}',
  {
    eager: true,
    import: 'default',
  },
);

const quoteImages = import.meta.glob('../user-story/**/quote.png', {
  eager: true,
  import: 'default',
});

const slugFromPath = path =>
  path.replace('../user-story/', '').replace('/index.yaml', '');

const mdToHtml = async content => {
  const processed = await remark().use(html).process(content);
  return processed.toString();
};

export const getStorySlugs = async () => {
  const stories = await Promise.all(
    Object.keys(storyFiles).map(async path => {
      const slug = slugFromPath(path);
      const raw = await storyFiles[path]();
      const yaml = await import('js-yaml');
      const data = yaml.load(raw) ?? {};
      return {
        slug,
        date: data.date,
      };
    }),
  );

  return stories
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(story => story.slug);
};

export const getStoryStaticPaths = async () => {
  const slugs = await getStorySlugs();
  return slugs.map(slug => `/user-story/${slug}`);
};

const getStoryRaw = async slug => {
  const key = `../user-story/${slug}/index.yaml`;
  const loader = storyFiles[key];

  if (!loader) {
    throw new Error(`Story not found: ${slug}`);
  }

  return await loader();
};

const getStoryImage = slug => {
  const entry = Object.entries(allImages).find(
    ([path]) =>
      path.startsWith(`../user-story/${slug}/`) && !path.endsWith('/quote.png'),
  );
  return entry ? entry[1] : null;
};

const getQuoteImage = slug => {
  const key = `../user-story/${slug}/quote.png`;
  return quoteImages[key] ?? null;
};

export const loadStoryData = async slug => {
  const raw = await getStoryRaw(slug);
  const yaml = await import('js-yaml');
  const data = yaml.load(raw) ?? {};

  const bodyContent = data.body_content ?? {};

  const paragraphs = Array.isArray(bodyContent.paragraphs)
    ? await Promise.all(
        bodyContent.paragraphs.map(paragraph =>
          typeof paragraph === 'string'
            ? mdToHtml(paragraph)
            : Promise.resolve(paragraph.html ?? ''),
        ),
      )
    : [];

  return {
    slug,
    story: {
      title: data.title,
      tag_line: data.tag_line,
      authored_by: data.authored_by,
      author: data.author,
    },
    title: data.title ?? data.metadata?.title ?? slug,
    date: data.date ? new Date(data.date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }) : '',
    authored_by: data.authored_by ?? data.author ?? '',
    author: data.authored_by ?? data.author ?? '',
    tag_line: data.tag_line ?? '',
    metadata: data.metadata ?? {},
    body_content: {
      ...bodyContent,
      paragraphs,
    },
    quotes: Array.isArray(data.quotes) ? data.quotes : [],
    image: getStoryImage(slug),
    quoteImage: getQuoteImage(slug),
  };
};

export const allStoriesLoader = async () => {
  const slugs = await getStorySlugs();
  return Promise.all(slugs.map(slug => loadStoryData(slug)));
};

export const loadUserStoryRouteData = async ({ params }) => {
  const slugs = await getStorySlugs();
  const index = slugs.indexOf(params.slug);
  const story = await loadStoryData(params.slug);

  const prev =
    index > 0
      ? {
          slug: slugs[index - 1],
          title: (await loadStoryData(slugs[index - 1])).title,
        }
      : null;

  const next =
    index >= 0 && index < slugs.length - 1
      ? {
          slug: slugs[index + 1],
          title: (await loadStoryData(slugs[index + 1])).title,
        }
      : null;

  return { ...story, prev, next };
};