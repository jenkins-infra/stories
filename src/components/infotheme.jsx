import React, { createContext, useState, useEffect } from 'react';

// Create the TripThemeContext
export const TripThemeContext = createContext({
  theme: 'light', // Default theme
  switchTheme: () => {}, // Function to switch theme
});

export const TripThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // State to manage the theme

  // Initialize theme on the client-side
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme'); // Check for saved theme in localStorage
    if (savedTheme) {
      setTheme(savedTheme); // Use saved theme if available
    } else {
      const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches; // Check OS-level dark mode preference
      setTheme(prefersDarkMode ? 'dark' : 'light'); // Set theme based on OS preference
    }
  }, []);

  // Update the document's data-theme attribute and save theme to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme); // Set data-theme attribute
    localStorage.setItem('theme', theme); // Save theme to localStorage
  }, [theme]);

  // Function to switch between light and dark themes
  const switchTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <TripThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </TripThemeContext.Provider>
  );
};

export default TripThemeProvider;
