import React, { useRef, useEffect } from 'react';
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
      <div className="card-inner">

        {image ? (
          <Link to={`/user-story/${slug}`} className="image-wrapper">
            <img
              src={image}
              alt={title}
              className="story-card-image"
              loading="lazy"
            />
          </Link>
        ) : null}

        <div className="content">
          <h2 className="title">{title}</h2>

          <div className="meta-info">
            <time className="date">{date}</time>
            <span className="separator">|</span>
            <jio-read-time-estimation
              ref={readTimeRef}
              class="read-time"
            />
          </div>

          {/* Real content used as source for read time (hidden) */}
          <div ref={readTimeSourceRef} style={{ display: 'none' }}>
            {body_content?.paragraphs?.map((p, idx) => (
              <div
                key={idx}
                dangerouslySetInnerHTML={{ __html: typeof p === 'string' ? p : p.html ?? '' }}
              />
            ))}
          </div>

          <p className="tagline">{tag_line}</p>

          <Link to={`/user-story/${slug}`} className="read-more">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserStoryCard;