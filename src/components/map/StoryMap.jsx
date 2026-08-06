import { useEffect, useRef, useState, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadMapPinsData } from '../../utils/storyload';
import StoryPopup from '../../components/story-popup/StoryPopUp';
import jenkinsMapPin from '../../assets/Images/jenkins_map_pin-180x180-1.png';
import './StoryMap.css';

function extractCountry(location) {
  if (!location) return 'Unknown';
  const parts = location.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : location.trim();
}

function createCustomMarker(L, story, fallbackIconUrl) {
  const imageUrl = story.image;

  const escapeHtmlAttr = value =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  if (!imageUrl) {
    return L.icon({
      iconUrl: fallbackIconUrl,
      iconSize: [40, 60],
      iconAnchor: [20, 60],
      popupAnchor: [0, -60],
    });
  }

  const safeImageUrl = escapeHtmlAttr(imageUrl);
  const safeTitle = escapeHtmlAttr(story.title);

  const markerHtml = `
    <div class="tmap-custom-marker">
      <div class="tmap-marker-pin"></div>
      <div class="tmap-marker-avatar">
        <img src="${safeImageUrl}" alt="${safeTitle}" loading="lazy" />
      </div>
    </div>
  `;

  return L.divIcon({
    html: markerHtml,
    className: 'tmap-custom-marker-icon',
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    popupAnchor: [0, -60],
  });
}

const StoryMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [status, setStatus] = useState('loading');
  const [stories, setStories] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMapPinsData()
      .then(all => {
        setStories(all.filter(s => s.map?.geojson && s.map?.location));
        setStatus('ready');
      })
      .catch(err => {
        setStatus('error');
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (status !== 'ready' || mapInstanceRef.current) return;

    import('leaflet').then(L => {
      const map = L.map(mapRef.current, {
        maxBounds: [
          [-90, -180],
          [90, 180],
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 2,
      }).setView([20, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
      }).addTo(map);

      stories.forEach(story => {
        try {
          const geojson =
            typeof story.map.geojson === 'string'
              ? JSON.parse(story.map.geojson)
              : story.map.geojson;
          const [lng, lat] = geojson.coordinates;
          if (typeof lat !== 'number' || typeof lng !== 'number') return;

          const markerIcon = createCustomMarker(L, story, jenkinsMapPin);
          const popupHtml = renderToStaticMarkup(<StoryPopup story={story} />);
          const marker = L.marker([lat, lng], { icon: markerIcon })
            .addTo(map)
            .bindPopup(popupHtml, { maxWidth: 300 });

          markersRef.current.push({ marker, story });
        } catch (e) {
          console.warn('Bad geojson for story:', story.slug, e);
        }
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [status, stories]);

  const allCountries = useMemo(() => {
    const set = new Set(stories.map(s => extractCountry(s.map.location)));
    return [...set].sort();
  }, [stories]);

  const allIndustries = useMemo(() => {
    const set = new Set(stories.flatMap(s => s.metadata?.industries || []));
    return [...set].sort();
  }, [stories]);

  const storiesByCountry = useMemo(() => {
    return stories.reduce((acc, story) => {
      const c = extractCountry(story.map.location);
      (acc[c] = acc[c] || []).push(story);
      return acc;
    }, {});
  }, [stories]);

  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      if (selectedCountry && !story.map.location.includes(selectedCountry))
        return false;
      if (
        selectedIndustry &&
        !story.metadata?.industries?.includes(selectedIndustry)
      )
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        return extractCountry(story.map.location).toLowerCase().startsWith(q);
      }
      return true;
    });
  }, [stories, selectedCountry, selectedIndustry, searchQuery]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const filteredSlugs = new Set(filteredStories.map(s => s.slug));
    markersRef.current.forEach(({ marker, story }) => {
      if (filteredSlugs.has(story.slug)) {
        if (!mapInstanceRef.current.hasLayer(marker)) {
          marker.addTo(mapInstanceRef.current);
        }
      } else {
        if (mapInstanceRef.current.hasLayer(marker)) {
          mapInstanceRef.current.removeLayer(marker);
        }
      }
    });
  }, [filteredStories]);

  const handleCountrySelect = country => {
    if (selectedCountry === country) {
      setSelectedCountry(null);
      mapInstanceRef.current?.setView([20, 0], 2);
    } else {
      setSelectedCountry(country);
      const countryStories = storiesByCountry[country] || [];
      let totalLat = 0,
        totalLng = 0,
        valid = 0;
      countryStories.forEach(story => {
        try {
          const geo =
            typeof story.map.geojson === 'string'
              ? JSON.parse(story.map.geojson)
              : story.map.geojson;
          if (geo?.coordinates?.length >= 2) {
            totalLng += geo.coordinates[0];
            totalLat += geo.coordinates[1];
            valid++;
          }
        } catch (e) {
          console.warn(
            'Bad geojson while centering on country:',
            story.slug,
            e,
          );
        }
      });
      if (valid > 0) {
        mapInstanceRef.current?.setView(
          [totalLat / valid, totalLng / valid],
          5,
        );
      }
    }
  };

  const resetFilters = () => {
    setSelectedCountry(null);
    setSelectedIndustry(null);
    setSearchQuery('');
    mapInstanceRef.current?.setView([20, 0], 2);
  };

  const totalCountries = allCountries.length;
  const sidebarSubtitle = `Explore ${stories.length} success stories from ${totalCountries} countries`;

  return (
    <div className="tmap-container">
      <div className="tmap-sidebar">
        <h2 className="tmap-sidebar-title">Jenkins Stories Around the World</h2>
        <p className="tmap-sidebar-subtitle">{sidebarSubtitle}</p>

        <div className="tmap-filter-controls">
          <div className="tmap-search-box">
            <input
              type="text"
              placeholder="Search stories by country..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="tmap-search-input"
              aria-label="Search stories"
            />
            {searchQuery && (
              <button
                className="tmap-clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <button
            className="tmap-filter-toggle"
            onClick={() => setShowFilters(v => !v)}
            aria-expanded={showFilters}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="tmap-filter-panel">
              <div className="tmap-filter-group">
                <label
                  htmlFor="tmap-industry-filter"
                  className="tmap-filter-label"
                >
                  Filter by Industry:
                </label>
                <select
                  id="tmap-industry-filter"
                  value={selectedIndustry || ''}
                  onChange={e => setSelectedIndustry(e.target.value || null)}
                  className="tmap-filter-select"
                >
                  <option value="">All Industries</option>
                  {allIndustries.map(ind => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <button
          className="tmap-reset-button"
          onClick={resetFilters}
          aria-label={selectedIndustry ? 'Remove filter' : 'View all countries'}
        >
          {selectedIndustry ? 'Remove Filter' : 'View All Countries'}
        </button>

        <div className="tmap-country-list">
          {status === 'loading' && (
            <p className="tmap-loading">Loading stories…</p>
          )}
          {allCountries
            .map(country => {
              const countryStories = storiesByCountry[country] || [];
              const visible = countryStories.filter(s =>
                filteredStories.includes(s),
              );
              if (visible.length === 0) return null;

              const isSelected = selectedCountry === country;
              return (
                <div
                  key={country}
                  className={`tmap-country-item${isSelected ? ' tmap-selected' : ''}`}
                  onClick={() => handleCountrySelect(country)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ')
                      handleCountrySelect(country);
                  }}
                >
                  <h3 className="tmap-country-name">
                    {country}{' '}
                    <span className="tmap-country-count">
                      ({visible.length})
                    </span>
                  </h3>

                  {isSelected && (
                    <ul className="tmap-story-list">
                      {visible.map(story => (
                        <li
                          key={story.slug}
                          className="tmap-story-item"
                        >
                          <a
                            href={`/user-story/${story.slug}`}
                            className="tmap-story-link"
                          >
                            {story.title}
                          </a>
                          <span className="tmap-story-location">
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

      <div className="tmap-map-wrapper">
        {status === 'error' && (
          <p style={{ color: 'red', padding: '1rem' }}>
            Failed to load map data.
          </p>
        )}
        <div ref={mapRef} className="tmap-map" />
      </div>
    </div>
  );
};

export default StoryMap;
