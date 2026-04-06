import React, { useRef, useEffect } from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import * as styles from './UserStoryCard.module.css';

function UserStoryCard({ slug, image, title, date, tag_line, body_content }) {
  const readTimeRef = useRef(null);
  const readTimeSourceRef = useRef(null);

  useEffect(() => {
    if (readTimeRef.current && readTimeSourceRef.current) {
      readTimeRef.current.content = readTimeSourceRef.current;
    }
  }, [body_content?.paragraphs]);

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
            <span className={styles.separator}>|</span>
            <jio-read-time-estimation
              ref={readTimeRef}
              class={styles.readTime}
            />
          </div>

          {/* Real content used as source (hidden but actual DOM) */}
          <div ref={readTimeSourceRef} style={{ display: 'none' }}>
            {body_content?.paragraphs?.map((p, idx) => (
              <div
                key={idx}
                dangerouslySetInnerHTML={{ __html: p.html }}
              />
            ))}
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

