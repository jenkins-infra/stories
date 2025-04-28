import React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import './HeroSection.css'; // Import your CSS file

function HeroSection() {
  return (
    <div className='hero-section'>
      <div className="hero-content">
        <h1 className="hero-title">Jenkins Is The Way</h1>
        <p className="hero-subtitle">
          Explore the latest Jenkins user stories.
        </p>
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
    </div>
  );
}

export default HeroSection;
