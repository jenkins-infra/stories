import React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import './MapSection.css'; // Import your CSS file

function MapSection({ isDarkMode }) {
  return (
    <div>
      <h2 className="section-title">Discover More</h2>
      <div className="map-content">
        <Link to="/map">
          {isDarkMode ? (
            <StaticImage
              src="../images/map_screenshot.png"
              alt="Screenshot of pins on a map"
              className="map-image"
            />
          ) : (
            <StaticImage
              src="../images/map_screenshot_light.png"
              alt="Screenshot of pins on a map"
              className="map-image"
            />
          )}
        </Link>
          <Link className="btn-primary" to="/map">
            Visit the Map
          </Link>
      </div>
    </div>
  );
}

export default MapSection;
