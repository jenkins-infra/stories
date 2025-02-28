import * as React from 'react';
import { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/Seo';
import UserStoryCard from '../components/UserStoryCard';
import SearchComponent from '../components/Searchbar';

// markup
const AllPage = () => {
  const title = 'Jenkins - User Story Library - All';
  const [searchTerm, setSearchTerm] = useState('');
  const { stories } = useStaticQuery(graphql`
    query AllStories {
      stories: allUserStory(sort: { fields: date, order: DESC }) {
        edges {
          node {
            title
            date(formatString: "dddd DD MMMM YYYY")
            tag_line
            image {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 150)
              }
            }
            slug
          }
        }
      }
    }
  `);
  const filteredStories = stories.edges.filter(({ node: story }) => {
    const searchString = searchTerm.toLowerCase();
        return story.title.toLowerCase().includes(searchString)
  });
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  return (
    <Layout title={title}>
      <Seo title={title} pathname="/all" />
      <div className="container">
        <div className="row body">
          <div className="col text-center">
            <h1>Jenkins Is The Way</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2>Tell Your Story</h2>
            <p>
              &quot;Jenkins Is The Way&quot; is a global showcase of how
              developers and engineers are building, deploying, and automating
              great stuff with Jenkins.
            </p>
            <p>
              Share your story and we'll send you a free Jenkins Is The Way
              T-shirt.
            </p>
            <p>
              <a href="/admin/#/collections/user-story">Share the story</a> of
              your project's goals, technical challenges, and the unique
              solutions you encountered with Jenkins.
            </p>
          </div>
        </div>
        <SearchComponent
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          resultsCount={filteredStories.length}
        />
        <div className="row">
          <div className="col">
            <h2>Jenkins User Stories</h2>
            {filteredStories.length > 0 ? (
              filteredStories.map(({ node: story }) => (
                <UserStoryCard
                  key={story.slug}
                  slug={story.slug}
                  image={story.image}
                  title={story.title}
                  date={story.date}
                  tag_line={story.tag_line}
                />
              ))
            ) : (
              <div className="alert alert-info">
                No stories found matching your search. Try different keywords or <button 
                  className="btn btn-link p-0"
                  onClick={() => setSearchTerm('')}
                >
                  clear the search
                </button>.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllPage;
