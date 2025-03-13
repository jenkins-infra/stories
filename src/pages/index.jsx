import * as React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { StaticImage, GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from '../layout';
import Seo from '../components/Seo';
import './index.css';

const IndexPage = () => {
  const title = 'Jenkins - User Story Library';
  const { stories } = useStaticQuery(graphql`
    query FrontPageStories {
      stories: allUserStory(sort: { fields: date, order: DESC }, limit: 5) {
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

  return (
    <Layout title={title}>
      <Seo title={title} pathname="/" />
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Jenkins Is The Way</h1>
          <p className="hero-subtitle">
            Explore the latest Jenkins user stories.
          </p>
          <StaticImage
            src="../images/Jenkins-is-the-Way-768x911.png"
            alt="Jenkins is the way logo"
            className="hero-image"
          />
        </div>
      </div>
      <div className="stories-section">
        <h2 className="section-title">Latest Jenkins User Stories</h2>
        <p className="section-subtitle">Stories from all around the world by Jenkins User</p>
        <div className="story-cards">
          {stories.edges.map(({ node: story }) => (
            <div key={story.slug} className="story-card">
              {story.image && story.image.childImageSharp && (
                <div className="story-image-container">
                  <GatsbyImage 
                    image={getImage(story.image)} 
                    alt={story.title} 
                    className="story-image"
                  />
                </div>
              )}
              <h3 className="story-title">
                {story.tag_line || story.title}
              </h3>
              <p className="story-author">
                Authored By Jenkins User <strong>{story.authored_by}</strong>
              </p>
              <p className="story-date">{story.date}</p>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <Link className="btn-primary" to="/all">
            Read More Stories
          </Link>
        </div>
      </div>
      <div className="map-section">
        <h2 className="section-title">Discover More</h2>
        <div className="map-content">
          <Link to='/map'>
            <StaticImage
              src="../images/map_screenshot.png"
              alt="Screenshot of pins on a map"
              className="map-image"
            />
          </Link>
          <Link className="btn-primary" to="/map">
            Visit the Map
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;