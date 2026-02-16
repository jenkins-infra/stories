/**
 * Helper function to extract country from location string
 * @param {string} location - The location string (e.g., "City, Country")
 * @returns {string} - The extracted country name or "Unknown"
 */
export function extractCountry(location) {
    if (!location) return 'Unknown';
    const parts = location.split(',');
    if (parts.length > 1) {
        return parts[parts.length - 1].trim();
    }
    return location.trim();
}

/**
 * Filter stories based on selected criteria
 * @param {Array} stories - List of story objects
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.selectedCountry] - Selected country name
 * @param {string} [filters.selectedIndustry] - Selected industry name
 * @param {string} [filters.searchQuery] - Search query string
 * @returns {Array} - Filtered list of stories
 */
export function filterStories(
    stories,
    {selectedCountry, selectedIndustry, searchQuery},
) {
    if (!stories) return [];

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

        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            const country = extractCountry(story.map.location).toLowerCase();
            return country.startsWith(query);
        }

        return true;
    });
}
