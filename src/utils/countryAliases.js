const countryAliases = {
    'usa': ['usa', 'us', 'america', 'united states', 'united states of america'],
    'united kingdom': ['uk', 'gb', 'gbr'],
    'united arab emirates': ['uae', 'ae'],
};

/**
 * Extract the actual country from a location string
 * e.g., "United Arab Emirates" -> "United Arab Emirates" , "UAE", "AE"
 * e.g., "USA" -> "USA", "united states", "us", "america"
 * @param {string} location - The full location string
 * @returns {string} The extracted country name
 */
export const extractCountryFromLocation = (location) => {
    if (!location) return '';

    const parts = location.split(',');
    // The country is typically the last part after splitting by comma
    return parts[parts.length - 1].trim();
};

/**
 * Check if a search term matches a country name (supporting aliases)
 * @param {string} location - The full location string
 * @param {string} searchTerm - The search term (country name or alias)
 * @returns {boolean} True if location's country matches the search term
 */
export const matchesCountry = (location, searchTerm) => {
    if (!location || !searchTerm) return false;

    const country = extractCountryFromLocation(location);
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const normalizedCountry = country.toLowerCase();

    if (normalizedCountry === normalizedSearch) {
        return true;
    }

    for (const [canonicalName, aliases] of Object.entries(countryAliases)) {
        if (normalizedCountry === canonicalName && aliases.includes(normalizedSearch)) {
            return true;
        }
    }

    return false;
};

export default countryAliases;
