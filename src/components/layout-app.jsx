import React from 'react';
import { TripThemeProvider } from './infotheme'; // Updated to use TripThemeProvider
import TripTheme from './triptheme'; // Theme toggle button
import './entire.css'; // Global styles
import './broadoverwrites.css'; // Jenkins layout plugin overrides

const LayoutApp = ({ children }) => {
  return (
    <TripThemeProvider>
      {children}
      <TripTheme /> {/* Theme toggle button */}
    </TripThemeProvider>
  );
};

export default LayoutApp;
