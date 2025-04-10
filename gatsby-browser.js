import React from 'react';
import LayoutApp from './src/components/layout-app'; // Use LayoutApp instead of TripThemeProvider
import './src/components/entire.css'; // Global styles for the entire project
import './src/components/triptheme.css'; // Theme toggle styles
import './src/components/broadoverwrites.css'; // Global CSS overrides for Jenkins layout plugin

// Wraps every page in the LayoutApp
export const wrapRootElement = ({ element }) => {
  return <LayoutApp>{element}</LayoutApp>;
};