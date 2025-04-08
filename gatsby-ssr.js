import React from 'react';
import AppWrapper from './src/components/AppWrapper';
import './src/components/GlobalOverrides.css';

// Wraps every page in a ThemeProvider
export const wrapRootElement = ({element}) => {
    return <AppWrapper>{element}</AppWrapper>;
};

// Add a script to prevent theme flashing during page load
export const onRenderBody = ({setPreBodyComponents}) => {
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
