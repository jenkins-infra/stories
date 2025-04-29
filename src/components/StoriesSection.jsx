import React from 'react';
import { Link } from 'gatsby';
import './StoriesSection.css';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { useEffect, useRef, useState } from 'react';

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
      return isVisible ? 'fadeVisible' : 'fadeHidden';
    }
    return isVisible
      ? 'fadeVisible fadeTransition'
      : 'fadeHidden fadeTransition';
  };
  return (
    <div  className={`${getClasses()}`} ref={sectionRef}>
      <div>
        <h2 className="section-title">Latest Jenkins User Stories</h2>
        <p className="section-subtitle">
          Stories from all around the world by Jenkins User
        </p>

        <div className="story-cards">
          {stories.edges.map(({ node: story }) => (
            <div key={story.slug} className="story-card">
              {story.image && story.image.childImageSharp && (
                <div className="story-image-container">
                  <GatsbyImage
                    image={getImage(story.image)}
                    alt={story.title}
                    className="story-image"
                  />
                </div>
              )}
              <h3 className="story-title">
                <Link to={`/user-story/${story.slug}`}>
                  {story.tag_line || story.title}
                </Link>
              </h3>
              <p className="story-author">
                Authored By Jenkins User <strong>{story.authored_by}</strong>
              </p>
              <p className="story-date">{story.date}</p>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <Link className="btn-primary" to="/all">
            Read More Stories
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StoriesSection;
