import React, { useEffect, useRef, useState } from 'react';
import Search from '../components/SearchContainer';
import * as styles from './SearchSection.module.css'; // Correct CSS Module import

function SearchSection() {
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
    <div className={`${styles.searchSection} ${getClasses()}`} ref={sectionRef}>
      <h1
        style={{
          marginTop: `3em`,
          textAlign: `center`,
          fontWeight: 700,
          color: `var(--text-color)`,
        }}
      >
        Search Jenkins Stories
      </h1>
      <div>
        <Search />
      </div>
    </div>
  );
}

export default SearchSection;
