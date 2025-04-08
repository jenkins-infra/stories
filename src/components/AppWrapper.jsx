import React from 'react';
import { ThemeProvider } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

const AppWrapper = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
      <ThemeToggle />
    </ThemeProvider>
  );
};

export default AppWrapper;
