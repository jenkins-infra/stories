import { remark } from 'remark';
import html from 'remark-html';
import jsYaml from 'js-yaml';

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

const slugsPromise = Promise.all(
  Object.keys(storyFiles).map(async path => {
    const raw = await storyFiles[path]();
    const data = jsYaml.load(raw) ?? {};
    return { slug: slugFromPath(path), date: data.date };
  }),
).then(stories =>
  stories.sort((a, b) => new Date(b.date) - new Date(a.date)).map(s => s.slug),
);  

export const getStorySlugs = () => slugsPromise;

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
  const data = jsYaml.load(raw) ?? {};

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
    sourcePath: `src/user-story/${slug}/index.yaml`,
    story: data,
    title: data.title ?? data.metadata?.title ?? slug,
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
