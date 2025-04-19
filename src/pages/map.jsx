import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/Seo';
import StoriesMap from '../components/StoriesMap';
import './MapPage.css';

const MapPage = () => {
  const title = 'Jenkins Is The Way';
  const { allUserStory, allStoriesForStats } = useStaticQuery(graphql`
    query {
      allUserStory(
        filter: { map: { geojson: { ne: null }, location: { ne: null } } }
      ) {
        totalCount
        edges {
          node {
            map {
              location
              geojson
            }
            metadata {
              industries
            }
          }
        }
      }
      allStoriesForStats: allUserStory {
        edges {
          node {
            metadata {
              industries
            }
          }
        }
      }
    }
  `);

  // Calculate stats dynamically
  const totalStories = allUserStory.totalCount;
  const uniqueLocations = new Set(
    allUserStory.edges
      .map(({ node }) => {
        const location = node.map?.location;
        if (!location) return null;
        const parts = location.split(',');
        return parts.length > 1
          ? parts[parts.length - 1].trim()
          : location.trim();
      })
      .filter(Boolean),
  ).size;

  // Calculate total unique industries from ALL stories
  const uniqueIndustries = new Set(
    allStoriesForStats.edges
      .flatMap(({ node }) => node.metadata?.industries || [])
      .filter(Boolean),
  ).size;

  const stats = [
    { value: totalStories, label: 'STORIES' },
    { value: uniqueLocations, label: 'LOCATIONS' },
    { value: uniqueIndustries, label: 'INDUSTRIES' },
  ];

  return (
    <Layout title={title}>
      <Seo title={title} pathname="/map" />

      <div className="container">
        <div className="row body">
          <div className="col text-center">
            <h1>Jenkins Is The Way</h1>
            <h2>Latest Jenkins User Stories</h2>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-container">
          {stats.map(({ value, label }) => (
            <div key={label} className="stat-box">
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col">
            <h3>
              Zoom into the map below to discover just where in the world you'll
              find Jenkins users and Jenkins solutions.
            </h3>
          </div>
        </div>

        <div className="map-container">
          <StoriesMap stories={allUserStory.edges} />
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
