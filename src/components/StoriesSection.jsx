import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';
import * as styles from './StoriesSection.module.css';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

function StoriesSection({ stories }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const newDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      setDirection(newDirection);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getClasses = () => {
    if (direction === 'up') {
      return isVisible ? styles.fadeVisible : styles.fadeHidden;
    }
    return isVisible
      ? `${styles.fadeVisible} ${styles.fadeTransition}`
      : `${styles.fadeHidden} ${styles.fadeTransition}`;
  };

  return (
    <div
      className={`${styles.storiesSection} ${getClasses()}`}
      ref={sectionRef}
    >
      <div>
        <h2 className={styles.sectionTitle}>Latest Jenkins User Stories</h2>
        <p className={styles.sectionSubtitle}>
          Stories from all around the world by Jenkins User
        </p>

        <div className={styles.storyCards}>
          {stories.edges.map(({ node: story }) => (
            <div key={story.slug} className={styles.storyCard}>
              {story.image && story.image.childImageSharp && (
                <div className={styles.storyImageContainer}>
                  <GatsbyImage
                    image={getImage(story.image)}
                    alt={story.title}
                    className={styles.storyImage}
                  />
                </div>
              )}
              <h3 className={styles.storyTitle}>
                <Link to={`/user-story/${story.slug}`}>
                  {story.tag_line || story.title}
                </Link>
              </h3>
              <p className={styles.storyAuthor}>
                Authored By Jenkins User <strong>{story.authored_by}</strong>
              </p>
              <p className={styles.storyDate}>{story.date}</p>
            </div>
          ))}
        </div>

        <div className={styles.sectionCta}>
          <Link className={styles.btnPrimary} to="/all">
            Read More Stories
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StoriesSection;