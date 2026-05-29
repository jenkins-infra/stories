const storyFiles = import.meta.glob('../user-story/**/index.yaml', {
  query: '?raw',
  import: 'default',
});

const slugFromPath = path =>
  path.replace('../user-story/', '').replace('/index.yaml', '');

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

export const loadStoryData = async slug => {
  const raw = await getStoryRaw(slug);
  const yaml = await import('js-yaml');
  const data = yaml.load(raw) ?? {};

  return {
    slug,
    story: data,
    title: data.title ?? data.metadata?.title ?? slug,
    authored_by: data.authored_by ?? data.author ?? '',
    author: data.authored_by ?? data.author ?? '',
    tag_line: data.tag_line ?? '',
    metadata: data.metadata ?? {},
    body_content: data.body_content ?? {},
    quotes: Array.isArray(data.quotes) ? data.quotes : [],
    image: data.image ?? null,
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
