const countryAliases = {
    'usa': ['usa', 'us', 'america', 'united states', 'united states of america'],
    'united kingdom': ['uk', 'gb', 'gbr'],
    'united arab emirates': ['uae', 'ae'],
};

export const extractCountryFromLocation = (location) => {
    if (!location) return '';
    const parts = location.split(',');
    // The country is typically the last part after splitting by comma
    return parts[parts.length - 1].trim();
};

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
