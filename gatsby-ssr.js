import React from 'react';
import LayoutApp from './src/components/layout-app'; // Use LayoutApp instead of TripThemeProvider
import './src/components/triptheme.css'; // Theme toggle styles
import './src/components/broadoverwrites.css'; // Global CSS overrides for Jenkins layout plugin

// Wraps every page in the LayoutApp
export const wrapRootElement = ({ element }) => {
  return <LayoutApp>{element}</LayoutApp>;
};

// Add a script to prevent theme flashing during page load
export const onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    <script
      key="theme-script"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          })();
        `,
      }}
    />,
  ]);
};