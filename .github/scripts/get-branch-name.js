import fs from 'node:fs';
import process from 'node:process';

const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'),
);

const raw = JSON.parse(
  fs.readFileSync('.story-submission/parsed.json', 'utf8'),
);

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
  const fromTitle = slugify(raw.story_title);
  if (fromTitle) return fromTitle;

  const fromOrg = slugify(raw.organization);
  if (fromOrg) return fromOrg;

  return `story-${Date.now().toString(36)}`;
}

const slug = deriveSlug();

console.log(`story/${slug}-issue-${event.issue.number}`);
