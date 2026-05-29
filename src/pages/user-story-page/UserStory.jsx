import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { remark } from 'remark';
import html from 'remark-html';
import './UserStory.css';

const titles = {
  build_tools: 'Build Tools',
  community_supports: 'Community Support',
  company: 'Company',
  company_website: 'Company Website',
  funded_by: 'Funded By',
  industries: 'Industries',
  organization: 'Organization',
  platforms: 'Platform',
  plugins: 'Custom Plugins',
  programming_languages: 'Programming Languages',
  project_funding: 'Project Funding',
  project_website: 'Project Website',
  summary: 'Summary',
  team_members: 'Team Members',
  teams: 'Team',
  version_control_systems: 'Version Control System',
};

const fields = [
  'organization',
  'company',
  'company_website',
  'teams',
  'team_members',
  'project_website',
  'project_funding',
  'funded_by',
  'summary',
  'industries',
  'programming_languages',
  'platforms',
  'version_control_systems',
  'build_tools',
  'plugins',
  'community_supports',
];

const formatValue = value => {
  if (value == null) return null;

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

const mdToHtml = async content => {
  const processed = await remark().use(html).process(content);

  return processed.toString();
};

export default function UserStory() {
  const data = useLoaderData();

  const story = data?.story ?? {};

  const authoredBy =
  story.authored_by ?? story.author ?? data?.authored_by ?? data?.author;

  const tagLine = story.tag_line ?? data?.tag_line;

  const metadata = story.metadata ?? data?.metadata ?? {};

  const body = story.body_content ?? data?.body_content ?? {};

  const quotes = story.quotes ?? data?.quotes ?? [];

  const [htmlParagraphs, setHtmlParagraphs] = React.useState([]);

  React.useEffect(() => {
    const parseMarkdown = async () => {
      if (!Array.isArray(body.paragraphs)) return;

      const parsed = await Promise.all(
        body.paragraphs.map(async paragraph => {
          if (typeof paragraph !== 'string') {
            return paragraph.html ?? '';
          }

          return await mdToHtml(paragraph);
        }),
      );

      setHtmlParagraphs(parsed);
    };

    parseMarkdown();
  }, [body.paragraphs]);

  return (
    <>
      <jio-navbar />

      <div className="story-navigation">
        {data?.prev ? (
          <Link to={`/user-story/${data.prev.slug}`} className="story-link">
            ← { (data.prev.title).replace("Jenkins is the way", "") || 'Previous story'}
          </Link>
        ) : (
          <div />
        )}

        {data?.next ? (
          <Link
            to={`/user-story/${data.next.slug}`}
            className="story-link next-link"
          >
            {(data.next.title).replace("Jenkins is the way", "") || 'Next story'} →
          </Link>
        ) : (
          <div />
        )}
      </div>

      <main className="story-container">
        <header className="story-header">
          <h1 className="story-title">
            {story.title ?? data?.title ?? 'Untitled'}
          </h1>

          {tagLine ? <p className="story-tagline">{tagLine}</p> : null}

          <p className="story-author">
            Authored by <strong>{authoredBy || 'Unknown'}</strong>
          </p>
        </header>

        {metadata.title ? (
          <section className="metadata-title-box">
            <strong>{metadata.title}</strong>
          </section>
        ) : null}

        {fields.some(field => metadata[field]) ? (
          <section className="metadata-grid">
            {fields
              .filter(field => metadata[field])
              .map(field => (
                <div key={field}>
                  <strong>{titles[field] || field}:</strong>{' '}
                  <span>{formatValue(metadata[field])}</span>
                </div>
              ))}
          </section>
        ) : null}

        <section className="story-content">
          {body.title ? (
            <h2 className="story-content-title">{body.title}</h2>
          ) : null}

          {htmlParagraphs.map((paragraph, index) => (
            <div
              key={index}
              className="story-paragraph"
              dangerouslySetInnerHTML={{
                __html: paragraph,
              }}
            />
          ))}
        </section>
      </main>

      <jio-footer />
    </>
  );
}
