import React from 'react';
import AppWrapper from './src/components/AppWrapper';
import './src/components/GlobalOverrides.css';

// Wraps every page in the ThemeProvider
export const wrapRootElement = ({element}) => {
    return <AppWrapper>{element}</AppWrapper>;
};
