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

const slugsPromise = Promise.resolve(Object.keys(caseFiles).map(slugFromPath)).then(
  slugs => [...new Set(slugs)].sort((a, b) => a.localeCompare(b)),
);

export const getCaseStudySlugs = () => slugsPromise;

export const getCaseStudyStaticPaths = async () => {
  const slugs = await getCaseStudySlugs();
  return slugs.map(slug => `/case-studies/${slug}`);
};

const getCaseStudyRaw = async slug => {
  const folderPrefix = `../case-studies/${slug}/`;
  const matches = Object.keys(caseFiles)
    .filter(k => k.startsWith(folderPrefix))
    .sort((a, b) => a.localeCompare(b));

  if (matches.length === 0) {
    throw new Error(`Case study not found: ${slug}`);
  }

  if (matches.length > 1) {
    throw new Error(
      `Multiple case study markdown files found for: ${slug}. Matches: ${matches.join(', ')}`,
    );
  }

  const key = matches[0];
  const loader = caseFiles[key];
  const raw = await loader();

  return { raw, key };
};

const getCaseStudyImage = slug => {
  const folderPrefix = `../case-studies/${slug}/`;
  const matches = Object.entries(allImages)
    .filter(([path]) => path.startsWith(folderPrefix))
    .sort(([a], [b]) => a.localeCompare(b));

  return matches.length > 0 ? matches[0][1] : null;
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

  return { title, authored_by, bodyRaw };
};

const loadCaseStudyDataBySlug = async slug => {
  const { raw, key } = await getCaseStudyRaw(slug);
  const { title, authored_by, bodyRaw } = parseCaseStudyMeta(raw);
  const bodyHtml = await mdToHtml(bodyRaw);

  return {
    slug,
    sourcePath: key.replace(/^\.\./, 'src'),
    title: title || slug,
    authored_by,
    bodyHtml,
    image: getCaseStudyImage(slug),
  };
};

const loadCaseStudySlim = async slug => {
  const { raw, key } = await getCaseStudyRaw(slug);
  const { title } = parseCaseStudyMeta(raw);

  return {
    slug,
    title: title || slug,
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
