import React, { useState, useEffect, useMemo } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { Icon, DivIcon } from 'leaflet';
import { TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import LeafletMap from './LeafletMap';
import StoryPopup from './StoryPopup';
import './Leaflet-global.css';
import * as styles from './StoriesMap.module.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Component to handle map view changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Create custom marker with user avatar
const createCustomMarker = (story, mapPin) => {
  // If no image, use default icon
  if (!story.image) {
    return new Icon({
      iconUrl: mapPin,
      iconSize: [40, 60],
      iconAnchor: [20, 60],
      popupAnchor: [0, -60],
    });
  }

  // Create a div for the marker with the user's avatar
  const markerHtml = `
    <div class="${styles.customMarker}">
      <div class="${styles.markerPin}"></div>
      <div class="${styles.markerAvatar}">
        <img src="${story.image.childImageSharp.gatsbyImageData.images.fallback.src}" alt="${story.title}" loading="lazy" />
      </div>
    </div>
  `;

  return new DivIcon({
    html: markerHtml,
    className: styles.customMarkerIcon,
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    popupAnchor: [0, -60],
  });
};

const StoriesMap = ({ mapPin }) => {
  // GraphQL query to fetch stories with location data
  const { allUserStory } = useStaticQuery(graphql`
    query StoriesMapQuery {
      allUserStory(
        sort: { date: DESC }
        filter: { map: { geojson: { ne: null }, location: { ne: null } } }
      ) {
        nodes {
          id
          slug
          title
          tag_line
          authored_by
          map {
            authored_by
            geojson
            location
          }
          image {
            childImageSharp {
              gatsbyImageData(layout: FIXED, width: 150)
            }
          }
          metadata {
            industries
            organization
          }
        }
      }
    }
  `);

  // Filter out stories without location data
  const storiesWithLocation = allUserStory.nodes.filter(
    story => story.map && story.map.geojson && story.map.location,
  );

  // Helper function to extract country from location string
  function extractCountry(location) {
    if (!location) return 'Unknown';
    const parts = location.split(',');
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    return location.trim();
  }

  const allCountries = useMemo(() => {
    const countries = storiesWithLocation.map(story =>
      extractCountry(story.map.location),
    );
    return [...new Set(countries)].sort();
  }, [storiesWithLocation]);

  // Calculate total stories and countries for the subtitle
  const totalStories = storiesWithLocation.length;
  const totalCountries = allCountries.length;

  // Create the dynamic subtitle
  const sidebarSubtitle = `Explore ${totalStories} success stories from ${totalCountries} countries`;

  const allIndustries = useMemo(() => {
    const industries = storiesWithLocation.flatMap(
      story => story.metadata?.industries || [],
    );
    return [...new Set(industries)].sort();
  }, [storiesWithLocation]);

  // Group stories by country
  const storiesByCountry = useMemo(() => {
    return storiesWithLocation.reduce((acc, story) => {
      const country = extractCountry(story.map.location);

      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(story);
      return acc;
    }, {});
  }, [storiesWithLocation]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([20, 0]); // Default center
  const [mapZoom, setMapZoom] = useState(2); // Default zoom
  const [showFilters, setShowFilters] = useState(false);

  // Avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter stories based on selected criteria
  const filteredStories = useMemo(() => {
    return storiesWithLocation.filter(story => {
      // Filter by country if selected
      if (selectedCountry && !story.map.location.includes(selectedCountry)) {
        return false;
      }

      // Filter by industry if selected
      if (
        selectedIndustry &&
        (!story.metadata?.industries ||
          !story.metadata.industries.includes(selectedIndustry))
      ) {
        return false;
      }

      // prefix-based country search
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const country = extractCountry(story.map.location).toLowerCase();
        return country.startsWith(query);
      }

      return true;
    });
  }, [storiesWithLocation, selectedCountry, selectedIndustry, searchQuery]);

  // Handle country selection
  const handleCountrySelect = country => {
    if (selectedCountry === country) {
      // If clicking the same country, deselect it
      setSelectedCountry(null);
      setMapCenter([20, 0]);
      setMapZoom(2);
    } else {
      setSelectedCountry(country);

      // Calculate average lat/lng for the country to center the map
      const stories = storiesByCountry[country];
      if (stories && stories.length > 0) {
        let totalLat = 0;
        let totalLng = 0;
        let validCoords = 0;

        stories.forEach(story => {
          try {
            const geojson = JSON.parse(story.map.geojson);
            if (
              geojson &&
              geojson.coordinates &&
              geojson.coordinates.length >= 2
            ) {
              const [longitude, latitude] = geojson.coordinates;
              totalLat += latitude;
              totalLng += longitude;
              validCoords++;
            }
          } catch (e) {
            console.error('Error parsing geojson:', e);
          }
        });

        if (validCoords > 0) {
          setMapCenter([totalLat / validCoords, totalLng / validCoords]);
          setMapZoom(5); // Zoom in when a country is selected
        }
      }
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCountry(null);
    setSelectedIndustry(null);
    setSearchQuery('');
    setMapCenter([20, 0]);
    setMapZoom(2);
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>
          Jenkins Stories Around the World
        </h2>
        <p className={styles.sidebarSubtitle}>{sidebarSubtitle}</p>

        {/* Search and filter controls */}
        <div className={styles.filterControls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search stories by country ..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search stories"
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <button
            className={styles.filterToggle}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div id="filter-panel" className={styles.filterPanel}>
              <div className={styles.filterGroup}>
                <label htmlFor="industry-filter" className={styles.filterLabel}>
                  Filter by Industry:
                </label>
                <select
                  id="industry-filter"
                  value={selectedIndustry || ''}
                  onChange={e => setSelectedIndustry(e.target.value || null)}
                  className={styles.filterSelect}
                >
                  <option value="">All Industries</option>
                  {allIndustries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <button
          className={styles.resetButton}
          onClick={resetFilters}
          aria-label={selectedIndustry ? 'Remove filter' : 'View all countries'}
        >
          {selectedIndustry ? 'Remove Filter' : 'View All Countries'}
        </button>

        <div className={styles.countryList}>
          {allCountries
            .map(country => {
              // Skip countries with no stories after filtering
              const countryStories = storiesByCountry[country] || [];
              const filteredCountryStories = countryStories.filter(story =>
                filteredStories.includes(story),
              );

              if (filteredCountryStories.length === 0) return null;

              return (
                <div
                  key={country}
                  className={`${styles.countryItem} ${selectedCountry === country ? styles.selected : ''}`}
                  onClick={() => handleCountrySelect(country)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedCountry === country}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCountrySelect(country);
                    }
                  }}
                >
                  <h3 className={styles.countryName}>
                    {country}{' '}
                    <span className={styles.countryCount}>
                      ({filteredCountryStories.length})
                    </span>
                  </h3>

                  {selectedCountry === country && (
                    <ul className={styles.storyList}>
                      {filteredCountryStories.map(story => (
                        <li key={story.id} className={styles.storyItem}>
                          <Link
                            to={`/user-story/${story.slug}`}
                            className={styles.storyLink}
                          >
                            {story.title}
                          </Link>
                          <span className={styles.storyLocation}>
                            {story.map.location}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
            .filter(Boolean)}
        </div>
      </div>

      <div className={styles.map}>
        {!isClient ? (
          <div className={styles.leafletContainer} aria-hidden="true" />
        ) : (
          <LeafletMap
            center={mapCenter}
            zoom={mapZoom}
            className={styles.leafletContainer}
            minZoom={2}
            maxBounds={[
              [-90, -180],
              [90, 180],
            ]}
            maxBoundsViscosity={1.0}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render markers directly without clustering */}
            {filteredStories
              .map(story => {
                try {
                  const geojson = JSON.parse(story.map.geojson);
                  const [longitude, latitude] = geojson.coordinates;

                  // Use custom marker with avatar if available
                  const markerIcon = createCustomMarker(story, mapPin);

                  return (
                    <Marker
                      key={story.id}
                      position={[latitude, longitude]}
                      icon={markerIcon}
                    >
                      <Popup>
                        <StoryPopup story={story} />
                      </Popup>
                    </Marker>
                  );
                } catch (e) {
                  console.error(
                    'Error parsing geojson for story:',
                    story.title,
                    e,
                  );
                  return null;
                }
              })
              .filter(Boolean)}
          </LeafletMap>
        )}
      </div>
    </div>
  );
};

export default StoriesMap;
