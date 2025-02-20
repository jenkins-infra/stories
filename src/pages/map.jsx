import * as React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Layout from '../layout';
import Seo from '../components/Seo';
import StatsCard from '../components/StatsCard';
import './MapPage.css';

const MapPage = () => {
  const title = 'Jenkins - User Story Library - Map';
  const { stories, mapPin } = useStaticQuery(graphql`
    query MapPageQueries {
      mapPin: file(name: { eq: "jenkins_map_pin2-e1634173081372" }) {
        publicURL
      }
      stories: allUserStory(
        sort: { fields: date, order: DESC }
        filter: { map: { geojson: { ne: null }, location: { ne: null } } }
      ) {
        edges {
          node {
            title
            map {
              authored_by
              geojson
              industries
              location
            }
            image {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 150)
              }
            }
            metadata {
              industries
            }
            slug
          }
        }
      }
    }
  `);

  const isBrowser = typeof window !== 'undefined';

  // Calculate stats
  const totalStories = stories.edges.length;
  const uniqueLocations = new Set(
    stories.edges.map(({ node }) => node.map.location),
  ).size;
  const allIndustries = stories.edges.flatMap(
    ({ node }) => node.map.industries || node.metadata.industries || [],
  );
  const uniqueIndustries = new Set(allIndustries).size;

  if (!isBrowser) {
    return (
      <Layout title={title}>
        <Seo title={title} pathname="/" />
        This page needs javascript
      </Layout>
    );
  }

  const icon = new Icon({
    iconUrl: mapPin.publicURL,
    iconAnchor: [29, 59],
    iconSize: [59, 59],
  });

  const StoryPopup = ({ story }) => (
    <div className="story-popup">
      {story.image && (
        <div className="story-popup-image">
          <Link to={`/user-story/${story.slug}`}>
            <GatsbyImage
              image={getImage(story.image)}
              alt={story.title}
            />
          </Link>
        </div>
      )}
      
      <div className="story-popup-content">
        <h4 className="story-popup-title">
          {story.title}
        </h4>
        
        <div className="story-popup-details">
          <div className="story-popup-row">
            <span className="story-popup-label">Author:</span>
            <span className="story-popup-value">{story.map.authored_by}</span>
          </div>
          
          <div className="story-popup-row">
            <span className="story-popup-label">Location:</span>
            <span className="story-popup-value">{story.map.location}</span>
          </div>
          
          <div className="story-popup-row">
            <span className="story-popup-label">Industries:</span>
            <span className="story-popup-value">
              {(story.map.industries || story.metadata.industries || []).join(', ')}
            </span>
          </div>
        </div>

        <div className='story-btn-container'>
          <Link 
            to={`/user-story/${story.slug}`}
            className="story-popup-button"
          >
            Read Story
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <Layout title={title}>
      <Seo title={title} pathname="/" />
      <div className="container">
        <div className="row text-center">
          <div className="col">
            <h1>Jenkins Is The Way</h1>
            <h2>Latest Jenkins User Stories</h2>
            {/* Stats Section */}
            <StatsCard
              totalStories={totalStories}
              uniqueLocations={uniqueLocations}
              uniqueIndustries={uniqueIndustries}
            />
            <h3>
              Zoom into the map below to discover just where in the world you'll
              find Jenkins users and Jenkins solutions.
            </h3>
          </div>
        </div>

        <div className="row map-container">
          <div className="col">
            <MapContainer
              center={[43.5890452, 0]}
              zoom={2}
              className="leaflet-map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {stories.edges
                .filter(({ node: story }) => story.map.geojson)
                .map(({ node: story }) => {
                  const geojson = JSON.parse(story.map.geojson);
                  const [longitude, latitude] = geojson.coordinates;

                  return (
                    <Marker
                      key={story.slug}
                      position={[latitude, longitude]}
                      icon={icon}
                    >
                      <Popup>
                        <StoryPopup story={story} />
                      </Popup>
                    </Marker>
                  );
                })}
            </MapContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
