import React from 'react';
import Search from '../components/SearchContainer';
import './SearchSection.css'; 

function SearchSection() {
  return (
    <div className='search-section section-visible'>
      <h1
        style={{
          marginTop: `3em`,
          textAlign: `center`,
          fontWeight: 700,
          color: `var(--text-color)`,
        }}
      >
        Search Jenkins Stories
      </h1>
      <div>
        <Search />
      </div>
    </div>
  );
}

export default SearchSection;
