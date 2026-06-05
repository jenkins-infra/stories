import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import './UserStory.css';
import Testimonial from '../../components/Testimonial';

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
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

export default function UserStory() {
  const data = useLoaderData();
  const story = data?.story ?? {};
  const authoredBy = story.authored_by ?? story.author ?? data?.authored_by ?? data?.author;
  const tagLine = story.tag_line ?? data?.tag_line;
  const metadata = data?.metadata ?? {};
  const body = data?.body_content ?? {};
  const storyImageSrc = data?.image ?? null;
  const htmlParagraphs = Array.isArray(body.paragraphs) ? body.paragraphs : [];
  const [storyImageErrorSrc, setStoryImageErrorSrc] = React.useState(null);
  const hasMetadata = fields.some(field => metadata[field]);
  const showStoryImage = storyImageSrc && storyImageSrc !== storyImageErrorSrc;
  const testimonial = data?.quotes?.[0] ?? story?.quotes?.[0] ?? null;
  const quoteImage = data?.quoteImage ?? null;

  return (
    <>
      <jio-navbar property="https://vite-stories-jenkins.netlify.app/" />

      <div className="story-navigation">
        {data?.prev ? (
          <Link to={`/user-story/${data.prev.slug}`} className="story-link">
            ← {data.prev.title || 'Previous story'}
          </Link>
        ) : (
          <div />
        )}

        {data?.next ? (
          <Link
            to={`/user-story/${data.next.slug}`}
            className="story-link next-link"
          >
            {data.next.title || 'Next story'} →
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

        {hasMetadata || showStoryImage ? (
          <section className="metadata-with-image">
            {showStoryImage ? (
              <div className="story-image-wrapper">
                <img
                  src={storyImageSrc}
                  height={250}
                  width={250}
                  alt={story.title ?? data?.title ?? 'Story image'}
                  className="story-image"
                  onError={() => setStoryImageErrorSrc(storyImageSrc)}
                  loading="lazy"
                />
              </div>
            ) : null}

            {hasMetadata ? (
              <div className="metadata-grid">
                {fields
                  .filter(field => metadata[field])
                  .map(field => (
                    <div key={field} className="metadata-row">
                      <strong>{titles[field] || field}:</strong>{' '}
                      <span>{formatValue(metadata[field])}</span>
                    </div>
                  ))}
              </div>
            ) : null}
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
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}

          {testimonial?.content && testimonial?.from ? (
            <Testimonial
              from={testimonial.from}
              image={quoteImage}
            >
              {testimonial.content}
            </Testimonial>
          ) : null}
        </section>
      </main>

      <jio-footer property="https://vite-stories-jenkins.netlify.app/" />
    </>
  );
}