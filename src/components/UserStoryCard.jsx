import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as styles from './UserStoryCard.module.css';
import estimateReadTime from '../utils/estimateReadTime';
function UserStoryCard({ slug, image, title, date, tag_line, body_content }) {
  
const minutes = body_content && body_content.paragraphs ? estimateReadTime(body_content.paragraphs) : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        {image && (
          <Link to={`/user-story/${slug}`} className={styles.imageWrapper}>
            <GatsbyImage
              image={getImage(image)}
              alt={title}
              className={styles.image}
              loading="lazy" // ✅ Ensures lazy loading
              placeholder="blurred" // ✅ Blurred placeholder effect while loading
            />
          </Link>
        )}
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.metaInfo}>
            <time className={styles.date}>{date}</time>
            {minutes && (
              <>
                <span className={styles.separator}>|</span>
                <span className={styles.readTime}>{minutes} min read</span>
              </>
            )}
          </div>
          <p className={styles.tagline}>{tag_line}</p>
          <Link to={`/user-story/${slug}`} className={styles.readMore}>
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserStoryCard;
