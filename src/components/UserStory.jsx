import React from 'react';
import PropTypes from 'prop-types';
import Testimonal from '../components/Testimonal';
import ImageWrapper from '../components/ImageWrapper';
import * as styles from './UserStory.module.css';

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

const formatField = value => {
  if (typeof value !== 'string') return value;

  const makeLink = (url, text) => (
    <a
      href={url.startsWith('http') ? url : `http://${url}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text || url}
    </a>
  );

  const markdownMatch = value.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
  if (markdownMatch) {
    const text = value
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/, '')
      .replace(/,?\s*$/, '')
      .trim();
    return (
      <>
        {text && `${text} `}
        {makeLink(markdownMatch[2], markdownMatch[1])}
      </>
    );
  }

  const angleRegex = /<(https?:\/\/[^>]+)>/g;
  const angleUrls = [...value.matchAll(angleRegex)];
  if (angleUrls.length > 0) {
    const text = value
      .replace(/,?\s*(and\s*)?<https?:\/\/[^>]+>;?/g, '')
      .trim();
    return (
      <>
        {text && `${text} `}
        {angleUrls.map((match, i) => (
          <span key={i}>
            {makeLink(match[1])}
            {i < angleUrls.length - 1 && ' and '}
          </span>
        ))}
      </>
    );
  }

  const quoteSepMatch = value.match(
    /^(.+?)\s*["""]\s*((?:https?:\/\/|www\.)\S+)$/,
  );
  if (quoteSepMatch) {
    return (
      <>
        {quoteSepMatch[1].trim()} {makeLink(quoteSepMatch[2])}
      </>
    );
  }

  const plainHttpMatch = value.match(/^(.*?),?\s*(https?:\/\/\S+?)\/?$/);
  if (plainHttpMatch && plainHttpMatch[2]) {
    const text = plainHttpMatch[1].trim();
    return (
      <>
        {text && `${text} `}
        {makeLink(plainHttpMatch[2])}
      </>
    );
  }

  const domainMatch = value.match(
    /^(.*?),?\s*((?:www\.)?[\w-]+\.(?:com|org|net|io|nl|pl|id|br|ps|jo|dk|au|fr|de|ch|uk)\/?\S*)$/i,
  );
  if (domainMatch && domainMatch[2]) {
    const text = domainMatch[1].trim();
    return (
      <>
        {text && `${text} `}
        {makeLink(domainMatch[2])}
      </>
    );
  }

  return value;
};

const UserStory = ({
  image,
  title,
  authored_by,
  tag_line,
  quotes,
  metadata,
  body_content,
}) => {
  return (
    <div className={styles.userstory}>
      <div className={`row ${styles.titlewrapper}`}>
        <div className={`col ${styles.title}`}>
          <div className="container">
            <h2>{title}</h2>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="container pb-2">
            <h1 className="textcolor">{tag_line}</h1>
          </div>

          <div className="container pt-2 pb-2">
            Authored By Jenkins User <strong>{authored_by}</strong>
          </div>

          <div className="container pt-2 pb-2">{metadata.title}</div>

          {fields.some(field => metadata[field]) && (
            <div className="container pt-2 pb-2">
              <div className="jumbotron">
                <div className="media d-block d-md-flex gap-3 align-items-center">
                  {image && (
                    <ImageWrapper
                      image={image}
                      alt="Logo"
                      className={`${styles.mediaImage}`}
                    />
                  )}
                  <div className="media-body">
                    {fields
                      .filter(field => metadata[field])
                      .map(field => (
                        <div key={field} className="pb-2">
                          <strong>{titles[field]}: </strong>
                          {Array.isArray(metadata[field])
                            ? metadata[field].join(', ')
                            : formatField(String(metadata[field]))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="container pt-2 pb-2">
            <h3>{body_content.title}</h3>
            {body_content.paragraphs &&
              body_content.paragraphs.reduce((content, p, idx) => {
                content.push(
                  <div
                    key={idx}
                    dangerouslySetInnerHTML={{
                      __html: p.html,
                    }}
                  />,
                );
                if (idx !== 0 && idx % 3 === 0) {
                  const quoteIdx = idx / 3 - 1;
                  if (quotes[quoteIdx]) {
                    content.push(
                      <div
                        key={`quote_container_${quoteIdx}`}
                        className={styles.speechBubbleWrapper}
                      >
                        <Testimonal
                          key={`quote_${quoteIdx}`}
                          from={quotes[quoteIdx].from}
                          image={quotes[quoteIdx].image}
                        >
                          <div className={styles.speechBubble}>
                            {quotes[quoteIdx].content}
                          </div>
                        </Testimonal>
                      </div>,
                    );
                  }
                }
                return content;
              }, [])}
          </div>
        </div>
      </div>
    </div>
  );
};

UserStory.displayName = 'UserStory';
UserStory.propTypes = {
  // children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  authored_by: PropTypes.string.isRequired,
  tag_line: PropTypes.string.isRequired,
  image: PropTypes.object,
  metadata: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  quotes: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.object,
      from: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }),
  ),
  body_content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    paragraphs: PropTypes.arrayOf(
      PropTypes.shape({
        html: PropTypes.string.isRequired,
      }),
    ),
  }),
};

export default UserStory;
