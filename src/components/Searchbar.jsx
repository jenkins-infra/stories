import * as React from 'react';
import * as styles from './Searchbar.module.css';

const SearchComponent = ({ onSearch, searchTerm, setSearchTerm, resultsCount }) => {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="row mb-4">
      <h3 className="card-title">Search Stories</h3>
      <div className="input-group gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="input-group-append">
          <button
            className={`btn btn-secondary ${styles.clearButton}`}
            type="button"
            onClick={handleClearSearch}
            disabled={!searchTerm}
          >
            Clear
          </button>
        </div>
      </div>
      {searchTerm && resultsCount !== undefined && (
        <small className={`${styles.resultsCount} mt-2 d-block`}>
          {resultsCount} results for "{searchTerm}"
        </small>
      )}
    </div>
  );
};

export default SearchComponent;