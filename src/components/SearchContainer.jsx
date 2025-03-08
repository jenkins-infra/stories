import React, { Component } from 'react';
import axios from 'axios';
import * as JsSearch from 'js-search';

class Search extends Component {
  state = {
    bookList: [],
    search: [],
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: '',
  };
  /**
   * React lifecycle method to fetch the data
   */
//   async componentDidMount() {
//     axios
//       .get('https://bvaughn.github.io/js-search/books.json')
//       .then(result => {
//         const bookData = result.data;
//         this.setState({ bookList: bookData.books });
//         this.rebuildIndex();
//         return null;
//       })
//       .catch(err => {
//         this.setState({ isError: true });
//       });
//   }

  /**
   * rebuilds the overall index based on the options
   */
  rebuildIndex = () => {
    const { bookList } = this.state;
    const dataToSearch = new JsSearch.Search('isbn');

    dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy();

    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer();

    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex('isbn');

    dataToSearch.addDocuments(bookList);
    this.setState({ search: dataToSearch, isLoading: false });
  };

  searchData = e => {
    const { search } = this.state;
    const queryResult = search.search(e.target.value);
    this.setState({ searchQuery: e.target.value, searchResults: queryResult });
  };
  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { bookList, searchResults, searchQuery } = this.state;
    const queryResults = searchQuery === '' ? bookList : searchResults;
    return (
      <div>
        <div style={{ margin: '0 auto' }}>
          <form onSubmit={this.handleSubmit}>
            <div style={{ margin: '0 auto' }}>
              <label htmlFor="Search" style={{ paddingRight: '10px' }}>
                Enter your search here
              </label>
              <input
                id="Search"
                value={searchQuery}
                onChange={this.searchData}
                placeholder="Enter your search here"
                style={{ margin: '0 auto', width: '400px' }}
              />
            </div>
          </form>
          <div>
            Number of items:
            {queryResults.length}
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                borderRadius: '4px',
                border: '1px solid #d3d3d3',
              }}
            >
              <thead style={{ border: '1px solid #808080' }}>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '5px',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderBottom: '2px solid #d3d3d3',
                      cursor: 'pointer',
                    }}
                  >
                    Book ISBN
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '5px',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderBottom: '2px solid #d3d3d3',
                      cursor: 'pointer',
                    }}
                  >
                    Book Title
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '5px',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderBottom: '2px solid #d3d3d3',
                      cursor: 'pointer',
                    }}
                  >
                    Book Author
                  </th>
                </tr>
              </thead>
              <tbody>
                {queryResults.map(item => {
                  return (
                    <tr key={`row_${item.isbn}`}>
                      <td
                        style={{
                          fontSize: '14px',
                          border: '1px solid #d3d3d3',
                        }}
                      >
                        {item.isbn}
                      </td>
                      <td
                        style={{
                          fontSize: '14px',
                          border: '1px solid #d3d3d3',
                        }}
                      >
                        {item.title}
                      </td>
                      <td
                        style={{
                          fontSize: '14px',
                          border: '1px solid #d3d3d3',
                        }}
                      >
                        {item.author}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default Search;
