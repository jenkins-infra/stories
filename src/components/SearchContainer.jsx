import React, { Component } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { ThemeContext } from './ThemeContext';
import './SearchContainer.css';
import * as JsSearch from 'js-search';

// ThemeContext consumer component
const SearchWithTheme = props => {
  return (
    <ThemeContext.Consumer>
      {themeContext => <Search {...props} themeContext={themeContext} />}
    </ThemeContext.Consumer>
  );
};

class Search extends Component {
  state = {
    stories: [],
    search: null,
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: '',
  };

  componentDidMount() {
    const { allUserStory } = this.props;
    try {
      const stories = allUserStory.nodes.map(story => ({
        title: story.title,
        authored_by: story.authored_by,
        slug: story.slug,
        date: story.date,
        image: story.image?.publicURL || null, // Use the public URL of the image
      }));

      this.initializeSearch(stories);
    } catch (err) {
      this.setState({ isError: true });
      console.error(`Error processing story data\n${err}`);
    }
  }

  initializeSearch = stories => {
    const dataToSearch = new JsSearch.Search('title');

    dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy();
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer();
    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex('title');

    dataToSearch.addIndex('title');
    dataToSearch.addIndex('authored_by');

    dataToSearch.addDocuments(stories);
    this.setState({
      stories,
      search: dataToSearch,
      isLoading: false,
    });
  };

  searchData = e => {
    const searchQuery = e.target.value;
    if (searchQuery) {
      const queryResult = this.state.search.search(searchQuery);
      this.setState({
        searchQuery,
        searchResults: queryResult,
      });
    } else {
      this.setState({
        searchQuery: '',
        searchResults: [],
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  formatDate = dateString => {
    const options = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  render() {
    const { searchResults, searchQuery, isLoading, isError } = this.state;
    const { themeContext } = this.props;
    const isDarkMode = themeContext && themeContext.theme === 'dark';

    if (isLoading) {
      return <div className="text-center p-4">Loading search...</div>;
    }

    if (isError) {
      return (
        <div className="text-center p-4 text-danger">Error loading search</div>
      );
    }

    return (
      <div className="container py-4 search-container">
        <form onSubmit={this.handleSubmit} className="mb-4">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="input-group">
                <input
                  id="Search"
                  className="form-control form-control-lg"
                  value={searchQuery}
                  onChange={this.searchData}
                  placeholder="Search user stories..."
                />
                <span className="input-group-text">
                  <ion-icon name="search-outline"></ion-icon>
                </span>
              </div>
            </div>
          </div>
        </form>

        {searchQuery && (
          <div>
            <p className="text-bold mb-4">
              Found {searchResults.length}{' '}
              {searchResults.length === 1 ? 'story' : 'stories'}
              &nbsp;for "{searchQuery}"
            </p>

            {searchResults.length > 0 ? (
              <div className="stories-grid">
                {searchResults.map((item, index) => (
                  <Link
                    to={`/user-story/${item.slug}`} // ✅ Navigate to the specific story
                    key={`story_${index}`}
                    className="story-card text-decoration-none"
                  >
                    <div className="card h-100">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="card-img-top"
                        />
                      )}
                      <div className="card-body">
                        <h3 className="h5 card-title">{item.title}</h3>
                        <div className="story-meta">
                          <p className="card-text text-muted">
                            Authored By <strong>{item.authored_by}</strong>
                          </p>
                          <time className="text-muted">
                            {this.formatDate(item.date)}
                          </time>
                        </div>
                        {item.metadata?.industries && (
                          <div className="industries">
                            {item.metadata.industries.map((industry, i) => (
                              <span
                                key={i}
                                className={`badge ${
                                  isDarkMode
                                    ? 'bg-dark text-light'
                                    : 'bg-light text-dark'
                                } me-1`}
                              >
                                {industry}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted">
                <p>No stories found matching your search</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const SearchContainer = () => {
  const data = useStaticQuery(graphql`
    query {
      allUserStory {
        nodes {
          title
          authored_by
          slug
          date
          image {
            publicURL # Fetch the public URL of the image
          }
        }
      }
    }
  `);

  return <SearchWithTheme allUserStory={data.allUserStory} />;
};

export default SearchContainer;
