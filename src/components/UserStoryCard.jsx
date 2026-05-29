import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserStoryCard.css';

function UserStoryCard({ slug, image, title, date, tag_line, body_content }) {
  const readTimeRef = useRef(null);
  const readTimeSourceRef = useRef(null);

  useEffect(() => {
    if (readTimeRef.current && readTimeSourceRef.current) {
      readTimeRef.current.content = readTimeSourceRef.current;
    }
  }, [body_content?.paragraphs]);

  return (
    <div className="card">
      <div className="cardInner">
        {image && (
          <Link to={`/user-story/${slug}`} className="imageWrapper">
            <img src={image} alt={title} className="image" loading="lazy" />
          </Link>
        )}

        <div className="content">
          <h2 className="title">{title}</h2>

          <div className="metaInfo">
            <time className="date">{date}</time>

            <span className="separator">|</span>

            <jio-read-time-estimation
              ref={readTimeRef}
              class={styles.readTime}
            />
          </div>

          {/* Hidden content used for read time calculation */}
          <div ref={readTimeSourceRef} style={{ display: 'none' }}>
            {body_content?.paragraphs?.map((p, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: p.html }} />
            ))}
          </div>

          <p className="tagline">{tag_line}</p>

          <Link to={`/user-story/${slug}`} className="readMore">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserStoryCard;
