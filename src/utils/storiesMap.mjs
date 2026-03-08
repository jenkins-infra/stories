export const DEFAULT_MAP_CENTER = [20, 0];
export const DEFAULT_MAP_ZOOM = 2;

export function extractCountry(location) {
  if (!location) return 'Unknown';
  const parts = location.split(',');
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  return location.trim();
}

export function groupStoriesByCountry(stories) {
  return stories.reduce((acc, story) => {
    const country = extractCountry(story.map.location);
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(story);
    return acc;
  }, {});
}

export function filterStories(
  stories,
  { selectedCountry = null, selectedIndustry = null, searchQuery = '' } = {},
) {
  const query = searchQuery.toLowerCase().trim();

  return stories.filter(story => {
    if (selectedCountry && !story.map.location.includes(selectedCountry)) {
      return false;
    }

    if (
      selectedIndustry &&
      (!story.metadata?.industries ||
        !story.metadata.industries.includes(selectedIndustry))
    ) {
      return false;
    }

    if (query) {
      const country = extractCountry(story.map.location).toLowerCase();
      return country.startsWith(query);
    }

    return true;
  });
}

export function getCenterForCountry(stories = []) {
  let totalLat = 0;
  let totalLng = 0;
  let validCoords = 0;

  stories.forEach(story => {
    try {
      const geojson = JSON.parse(story.map.geojson);
      if (geojson && geojson.coordinates && geojson.coordinates.length >= 2) {
        const [longitude, latitude] = geojson.coordinates;
        totalLat += latitude;
        totalLng += longitude;
        validCoords++;
      }
    } catch {
      // ignore malformed geojson entries
    }
  });

  if (validCoords === 0) {
    return null;
  }

  return [totalLat / validCoords, totalLng / validCoords];
}
