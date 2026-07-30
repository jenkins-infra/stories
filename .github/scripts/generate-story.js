import fs from 'node:fs';
import * as yaml from 'js-yaml';
import { downloadImages } from './download-images.js';
import process from 'node:process';
import { execSync } from "node:child_process";

const raw = JSON.parse(
  fs.readFileSync('.story-submission/parsed.json', 'utf8'),
);

function norm(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === '_No response_') return '';
    return trimmed;
  }
  return value;
}

function normalizeUrl(value, fieldLabel) {
  if (!value) return '';

  let candidate = value.trim();

  const mdLink = candidate.match(/\[.*?\]\(([^)]+)\)/);
  if (mdLink) candidate = mdLink[1].trim();

  const angleBracketed = candidate.match(/^<(.+)>$/);
  if (angleBracketed) candidate = angleBracketed[1].trim();

  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    return new URL(candidate).toString();
  } catch {
    throw new Error(
      `Could not parse "${fieldLabel}" as a URL (got: "${value}"). Please provide a valid website address.`,
    );
  }
}

const form = {
  title: norm(raw.story_title),
  organization: norm(raw.organization),
  company_website: normalizeUrl(norm(raw.company_website), 'Company Website'),
  project_website: normalizeUrl(norm(raw.project_website), 'Project Website'),
  project_funding: norm(raw.project_funding),
  funded_by: norm(raw.funded_by),
  author: norm(raw.author_name),
  location: norm(raw.organization_location),
  tag_line: norm(raw.tag_line),
  summary: norm(raw.summary),
  story: norm(raw.your_story)
    .replace(/^```markdown\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim(),
  industries: norm(raw.industries),
  programming_languages: norm(raw.programming_languages),
  platforms: norm(raw.platforms),
  version_control_systems: norm(raw.version_control_systems),
  build_tools: norm(raw.build_tools),
  plugins: norm(raw.plugins ?? raw.jenkins_plugins),
  community_supports: norm(raw.community_support),
  teams: norm(raw.teams),
  team_members: norm(raw.team_members),
  quote: norm(raw.quote),
  quote_from: norm(raw.quote_author),
};

function array(id) {
  const value = form[id];
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split('\n')
    .map(v => norm(v))
    .filter(Boolean);
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function deriveSlug() {
  const fromTitle = slugify(form.title);
  if (fromTitle) return fromTitle;

  const fromOrg = slugify(form.organization);
  if (fromOrg) return fromOrg;

  return `story-${Date.now().toString(36)}`;
}

function clean(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === '' || value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      continue;
    }
    result[key] = value;
  }
  return result;
}

const slug = deriveSlug();
const storyDir = `src/user-story/${slug}`;

function existsOnBaseBranch(path) {
  try {
    execSync(
      `git show origin/main:${path}`,
      { stdio: "ignore" }
    );
    return true;
  } catch {
    return false;
  }
}

const storyFile = `${storyDir}/index.yaml`;

if (existsOnBaseBranch(storyFile)) {
  console.error(
    `A published story already exists at ${storyDir}. ` +
    `If this is a genuinely new submission, its title collides with an existing story slug.`
  );
  process.exit(1);
}

fs.mkdirSync(storyDir, { recursive: true });

const images = await downloadImages(raw, storyDir);

const paragraphs = form.story
  .split(/\n\s*\n/)
  .map(p => p.trim())
  .filter(Boolean);

const story = clean({
  title: form.title,
  post_name: slug,
  date: new Date().toISOString(),
  authored_by: form.author,
  tag_line: form.tag_line,
  image: images.story,

  metadata: clean({
    title: form.title,
    organization: form.organization,
    company_website: form.company_website,
    project_website: form.project_website,
    project_funding: form.project_funding,
    funded_by: form.funded_by,
    summary: form.summary,
    teams: array('teams'),
    team_members: array('team_members'),
    industries: array('industries'),
    programming_languages: array('programming_languages'),
    platforms: array('platforms'),
    version_control_systems: array('version_control_systems'),
    build_tools: array('build_tools'),
    plugins: array('plugins'),
    community_supports: array('community_supports'),
  }),

  map: clean({
    authored_by: form.author,
    location: form.location,
    industries: array('industries'),
    geojson: '',
  }),

  body_content: {
    title: form.title,
    paragraphs,
  },

  quotes: form.quote
    ? [
        clean({
          from: form.quote_from,
          content: form.quote,
          image: images.quote,
        }),
      ]
    : [],
});

fs.writeFileSync(
  `${storyDir}/index.yaml`,
  yaml.dump(story, { lineWidth: -1, noRefs: true }),
);

fs.mkdirSync('.story-submission', { recursive: true });
fs.writeFileSync(
  '.story-submission/output.json',
  JSON.stringify({
    slug,
    path: `${storyDir}/index.yaml`,
  }, null, 2),
);

console.log(`Generated ${storyDir}/index.yaml`);
