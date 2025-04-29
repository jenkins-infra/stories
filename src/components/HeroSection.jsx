import React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import './HeroSection.css'; // Import your CSS file
import { useEffect, useRef, useState } from 'react';

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
    <div className={`hero-content ${getClasses()}`} ref={sectionRef}>
      <h1 className="hero-title">Jenkins Is The Way</h1>
      <p className="hero-subtitle">Explore the latest Jenkins user stories.</p>
      <div className="hero-buttons">
        <Link to="/all" className="hero-button">
          View All Stories
        </Link>
        <Link to="/map" className="hero-button hero-button-secondary">
          Explore Map
        </Link>
      </div>
      <StaticImage
        src="../images/Jenkins-is-the-Way-768x911.png"
        alt="Jenkins is the way logo"
        className="hero-image"
      />
    </div>
  );
}

export default HeroSection;
