import React, { useContext } from 'react';
import { TripThemeContext } from './infotheme'; // Corrected import
import './triptheme.css';

const TripTheme = () => {
  const { theme, switchTheme } = useContext(TripThemeContext); // Updated context

  return (
    <button
      className="trip-theme-toggle"
      onClick={switchTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sun-icon"
        >
          <circle cx="12" cy="12" r="5" fill="yellow"></circle>
          <line x1="12" y1="1" x2="12" y2="4" stroke="orange"></line>
          <line x1="12" y1="20" x2="12" y2="23" stroke="orange"></line>
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="orange"></line>
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="orange"></line>
          <line x1="1" y1="12" x2="4" y2="12" stroke="orange"></line>
          <line x1="20" y1="12" x2="23" y2="12" stroke="orange"></line>
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="orange"></line>
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="orange"></line>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="moon-icon"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>
  );
};

export default TripTheme;
