import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference or use OS preference
  const [theme, setTheme] = useState('light');

  // Initialize theme on client-side
  useEffect(() => {
    // Get saved preference from localStorage
    const savedTheme = localStorage.getItem('theme');

    // If there's a saved theme preference, use it
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check OS preference
      const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      setTheme(prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

  // Update document attributes when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
