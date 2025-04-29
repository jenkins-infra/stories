import React from 'react';
import Search from '../components/SearchContainer';
import './SearchSection.css';
import { useEffect, useRef, useState } from 'react';

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
      return isVisible ? 'fadeVisible' : 'fadeHidden';
    }
    return isVisible
      ? 'fadeVisible fadeTransition'
      : 'fadeHidden fadeTransition';
  };
  return (
    <div className={`${getClasses()}`} ref={sectionRef}>
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
