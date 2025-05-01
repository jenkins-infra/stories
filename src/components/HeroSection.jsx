import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import * as styles from './HeroSection.module.css'; // using CSS modules

function HeroSection() {
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
      { threshold: 0.1, rootMargin: '0px 0px -300px 0px' },
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
    <div className={`${styles.heroSection} ${getClasses()}`} ref={sectionRef}>
      <div className={`${styles.heroContent}`}>
        <h1 className={styles.heroTitle}>Jenkins Is The Way</h1>
        <p className={styles.heroSubtitle}>
          Explore the latest Jenkins user stories.
        </p>
        <div className={styles.heroButtons}>
          <Link to="/all" className={styles.heroButton}>
            View All Stories
          </Link>
          <Link
            to="/map"
            className={`${styles.heroButton} ${styles.heroButtonSecondary}`}
          >
            Explore Map
          </Link>
        </div>
        <StaticImage
          src="../images/Jenkins-is-the-Way-768x911.png"
          alt="Jenkins is the way logo"
          className={styles.heroImage}
        />
      </div>
    </div>
  );
}

export default HeroSection;
