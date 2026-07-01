import { Link, useLoaderData } from 'react-router-dom';
import './StoryPage.css';

const titles = {
  build_tools: 'Build Tools',
  community_supports: 'Community Support',
  company_website: 'Company Website',
  industries: 'Industries',
  organization: 'Organization',
  platforms: 'Platforms',
  plugins: 'Custom Plugins',
  programming_languages: 'Programming Languages',
  project_funding: 'Project Funding',
  project_website: 'Project Website',
  summary: 'Summary',
  team_members: 'Team Members',
  version_control_systems: 'Version Control System',
};

const fields = [
  'organization',
  'company_website',
  'team_members',
  'project_website',
  'project_funding',
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

export default function StoryPage() {
  const data = useLoaderData();
  const story = data?.story ?? {};
  const authoredBy =
    story.authored_by ?? story.author ?? data?.authored_by ?? data?.author;
  const tagLine = story.tag_line ?? data?.tag_line;
  const metadata = data?.metadata ?? {};
  const body = data?.body_content ?? {};
  const htmlParagraphs = Array.isArray(body.paragraphs) ? body.paragraphs : [];
  const storyImageSrc = data?.image ?? null;
  const metadataFields = fields.filter(field => metadata[field]);
  const hasImage = Boolean(storyImageSrc);
  const hasMetadata = metadataFields.length > 0;

  return (
    <>
      <div className="story-navigation">
        {data?.prev && (
          <Link to={`/user-story/${data.prev.slug}`} className="story-link">
            ←{' '}
            {data.prev.title.replace('Jenkins is the way', '') ||
              'Previous story'}
          </Link>
        )}

        {data?.next && (
          <Link
            to={`/user-story/${data.next.slug}`}
            className="story-link next-link"
          >
            {data.next.title.replace('Jenkins is the way', '') || 'Next story'}{' '}
            →
          </Link>
        )}
      </div>

      <main className="story-container">
        <header className="story-header">
          <h1 className="story-title">
            {story.title ?? data?.title ?? 'Untitled'}
          </h1>

          {tagLine && <p className="story-tagline">{tagLine}</p>}

          <p className="story-author">
            Authored by <strong>{authoredBy || 'Unknown'}</strong>
          </p>
        </header>

        {metadata.title && (
          <section className="metadata-title-box">
            <strong>{metadata.title}</strong>
          </section>
        )}

        {(hasImage || hasMetadata) && (
          <section className="metadata-with-image">
            {hasImage && (
              <div className="story-image-wrapper">
                <img
                  src={storyImageSrc}
                  alt={story.title ?? data?.title ?? 'Story image'}
                  className="story-image"
                  loading="lazy"
                />
              </div>
            )}

            {hasMetadata && (
              <div className="metadata-grid">
                {metadataFields.map(field => (
                  <div key={field} className="metadata-row">
                    <strong>{titles[field] || field}:</strong>{' '}
                    <span>{formatValue(metadata[field])}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="story-content">
          {body.title && <h2 className="story-content-title">{body.title}</h2>}

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
    </>
  );
}
