import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import * as styles from './MapSection.module.css';

function MapSection({ isDarkMode }) {
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
    <div className={`${styles.mapSection} ${getClasses()}`} ref={sectionRef}>
      <h2 className={styles.sectionTitle}>Discover More</h2>
      <div className={styles.mapContent}>
        <Link to="/map">
          {isDarkMode ? (
            <StaticImage
              src="../images/map_screenshot.png"
              alt="Screenshot of pins on a map"
              className={styles.mapImage}
            />
          ) : (
            <StaticImage
              src="../images/map_screenshot_light.png"
              alt="Screenshot of pins on a map"
              className={styles.mapImage}
            />
          )}
        </Link>
        <Link className={styles.btnPrimary} to="/map">
          Visit the Map
        </Link>
      </div>
    </div>
  );
}

export default MapSection;