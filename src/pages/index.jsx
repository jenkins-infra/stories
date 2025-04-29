import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/Seo';
import './index.css';
import HeroSection from '../components/HeroSection';
import SearchSection from '../components/SearchSection';
import MapSection from '../components/MapSection';
import StoriesSection from '../components/StoriesSection';

const IndexPage = () => {
  const title = 'Jenkins - User Story Library';
  const { stories } = useStaticQuery(graphql`
    query FrontPageStories {
      stories: allUserStory(sort: { date: DESC }, limit: 4) {
        edges {
          node {
            title
            date(formatString: "dddd DD MMMM YYYY")
            tag_line
            authored_by
            slug
            image {
              childImageSharp {
                gatsbyImageData(width: 400, height: 200)
              }
            }
          }
        }
      }
    }
  `);
  console.log(stories.edges);

  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Dark Mode Detection
  React.useEffect(() => {
    const checkDarkMode = () => {
      const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)',
      );
      setIsDarkMode(darkModeMediaQuery.matches);
    };
    checkDarkMode();
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    darkModeMediaQuery.addEventListener('change', checkDarkMode);
    return () =>
      darkModeMediaQuery.removeEventListener('change', checkDarkMode);
  }, []);

  return (
    <Layout title={title}>
      <Seo title={title} pathname="/" />
      <div className="hero-section section-visible">
        <HeroSection></HeroSection>
      </div>
      <div>
        <SearchSection className="search-section section-visible"></SearchSection>
      </div>
      <div className="stories-section section-visible">
        <StoriesSection stories={stories}></StoriesSection>
      </div>
      <div className='map-section section-visible'>
        <MapSection isDarkMode={isDarkMode}></MapSection>
      </div>
    </Layout>
  );
};

export default IndexPage;
