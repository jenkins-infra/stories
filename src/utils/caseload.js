import { remark } from 'remark';
import html from 'remark-html';

const caseFiles = import.meta.glob('../case-studies/**/*.md', {
  query: '?raw',
  import: 'default',
});

const allImages = import.meta.glob(
  '../case-studies/**/*.{png,jpg,jpeg,webp,svg}',
  {
    eager: true,
    import: 'default',
  },
);

const slugFromPath = path =>
  path.replace('../case-studies/', '').replace(/\/[^/]+\.md$/, '');

const mdToHtml = async content => {
  const processed = await remark().use(html).process(content);
  return processed.toString();
};

const slugsPromise = Promise.all(
  Object.keys(caseFiles).map(async path => ({
    slug: slugFromPath(path),
  })),
).then(slugs => slugs.map(s => s.slug).sort((a, b) => a.localeCompare(b)));

export const getCaseStudySlugs = () => slugsPromise;

export const getCaseStudyStaticPaths = async () => {
  const slugs = await getCaseStudySlugs();
  return slugs.map(slug => `/case-studies/${slug}`);
};

const getCaseStudyRaw = async slug => {
  const folderPrefix = `../case-studies/${slug}/`;
  const key = Object.keys(caseFiles).find(k => k.startsWith(folderPrefix));

  if (!key) {
    throw new Error(`Case study not found: ${slug}`);
  }

  const loader = caseFiles[key];
  const raw = await loader();

  return { raw, key };
};

const getCaseStudyImage = slug => {
  const folderPrefix = `../case-studies/${slug}/`;
  const entry = Object.entries(allImages).find(([path]) =>
    path.startsWith(folderPrefix),
  );

  return entry ? entry[1] : null;
};

const parseCaseStudyMeta = raw => {
  const lines = raw.split(/\r?\n/);

  let idx = 0;
  while (idx < lines.length && lines[idx].trim() === '') idx++;

  const firstLine = lines[idx] ?? '';
  const title = firstLine.replace(/^#+\s*/, '').trim() ?? '';

  let nextIdx = idx + 1;
  while (nextIdx < lines.length && lines[nextIdx].trim() === '') nextIdx++;
  const authorLine = lines[nextIdx] ?? '';
  const authored_by = authorLine.startsWith('By ')
    ? authorLine.replace(/^By\s+/, '').trim()
    : '';

  const bodyStart = authored_by ? nextIdx + 1 : idx + 1;
  const bodyLines = lines.slice(bodyStart);
  const bodyRaw = bodyLines.join('\n').replace(/^\s+/, '');

  const sections = bodyRaw
    .split(/\r?\n\s*\r?\n/)
    .map(section => section.trim())
    .filter(Boolean);

  const excerpt =
    sections.length > 0 ? sections[0].replace(/\r?\n/g, ' ').trim() : '';

  return { title, authored_by, excerpt, bodyRaw };
};

const loadCaseStudyDataBySlug = async slug => {
  const { raw, key } = await getCaseStudyRaw(slug);
  const { title, authored_by, excerpt, bodyRaw } = parseCaseStudyMeta(raw);
  const bodyHtml = await mdToHtml(bodyRaw);

  return {
    slug,
    sourcePath: key.replace(/^\.\./, 'src'),
    title: title || slug,
    authored_by,
    excerpt,
    bodyHtml,
    image: getCaseStudyImage(slug),
  };
};

const loadCaseStudySlim = async slug => {
  const { raw, key } = await getCaseStudyRaw(slug);
  const { title, excerpt } = parseCaseStudyMeta(raw);

  return {
    slug,
    title: title || slug,
    excerpt,
    image: getCaseStudyImage(slug),
    sourcePath: key.replace(/^\.\./, 'src'),
  };
};

export const loadAllCaseStudiesRouteData = async () => {
  const slugs = await getCaseStudySlugs();
  return Promise.all(slugs.map(loadCaseStudySlim));
};

export const loadCaseStudyRouteData = async ({ params }) => {
  return await loadCaseStudyDataBySlug(params.slug);
};
