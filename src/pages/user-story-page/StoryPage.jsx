import { Link, useLoaderData } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import Testimonial from '../../components/testimonial/Testimonial.jsx';
import './StoryPage.css';

const BASE_URL = 'https://stories.jenkins.io';

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
  const quotes = Array.isArray(data?.quotes) ? data.quotes : [];
  const testimonial = quotes[0];
  const quoteImage = data?.quoteImage ?? null;
  const hasTestimonial = Boolean(testimonial?.content && testimonial?.from);
  const pageTitle = story.title ?? data?.title ?? 'Jenkins User Story';
  const ogImage = storyImageSrc ? `${BASE_URL}${storyImageSrc}` : `${BASE_URL}/opengraph.png`;
  const ogUrl = `${BASE_URL}/user-story/${data?.slug ?? ''}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={tagLine ?? ''} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={tagLine ?? ''} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
      </Head>
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

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link" aria-label="Home">
          <svg
            className="breadcrumb-home-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
          </svg>
        </Link>
        <span className="breadcrumb-separator" aria-hidden="true">/</span>
        <Link to="/all" className="breadcrumb-link">
          User stories
        </Link>
        <span className="breadcrumb-separator" aria-hidden="true">/</span>
        <span className="breadcrumb-current" aria-current="page">{pageTitle}</span>
      </nav>

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

          {hasTestimonial && (
            <Testimonial from={testimonial.from} image={quoteImage}>
              {testimonial.content}
            </Testimonial>
          )}
        </section>
      </main>
    </>
  );
}
