import { extractCountry, filterStories } from './mapUtils';

describe('extractCountry', () => {
  it('should return "Unknown" for null or undefined location', () => {
    expect(extractCountry(null)).toBe('Unknown');
    expect(extractCountry(undefined)).toBe('Unknown');
  });

  it('should return the location itself if there are no commas', () => {
    expect(extractCountry('Japan')).toBe('Japan');
    expect(extractCountry('  France  ')).toBe('France');
  });

  it('should extract the last part of a comma-separated string', () => {
    expect(extractCountry('Tokyo, Japan')).toBe('Japan');
    expect(extractCountry('Paris, France')).toBe('France');
    expect(extractCountry('City, State, USA')).toBe('USA');
  });

  it('should handle whitespace correctly', () => {
    expect(extractCountry(' London , UK ')).toBe('UK');
  });
});

describe('filterStories', () => {
  const mockStories = [
    {
      id: '1',
      title: 'Story 1',
      map: { location: 'Tokyo, Japan' },
      metadata: { industries: ['Tech', 'Finance'] },
    },
    {
      id: '2',
      title: 'Story 2',
      map: { location: 'Paris, France' },
      metadata: { industries: ['Retail'] },
    },
    {
      id: '3',
      title: 'Story 3',
      map: { location: 'New York, USA' },
      metadata: { industries: ['Tech'] },
    },
  ];

  it('should return all stories if no filters are provided', () => {
    const result = filterStories(mockStories, {});
    expect(result).toHaveLength(3);
  });

  it('should return empty array if stories input is null/undefined', () => {
    expect(filterStories(null, {})).toEqual([]);
    expect(filterStories(undefined, {})).toEqual([]);
  });

  it('should filter by selectedCountry', () => {
    const result = filterStories(mockStories, { selectedCountry: 'Japan' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Story 1');
  });

  it('should filter by selectedIndustry', () => {
    const result = filterStories(mockStories, { selectedIndustry: 'Tech' });
    expect(result).toHaveLength(2);
    expect(result.map(s => s.title)).toEqual(['Story 1', 'Story 3']);
  });

  it('should filter by searchQuery (prefix of country)', () => {
    // "Ja" -> matches "Japan"
    const resultJapan = filterStories(mockStories, { searchQuery: 'Ja' });
    expect(resultJapan).toHaveLength(1);
    expect(resultJapan[0].title).toBe('Story 1');

    // "f" -> matches "France"
    const resultFrance = filterStories(mockStories, { searchQuery: 'f' });
    expect(resultFrance).toHaveLength(1);
    expect(resultFrance[0].title).toBe('Story 2');
  });

  it('should combine filters correctly', () => {
    // Country: USA + Industry: Tech -> Story 3
    const result = filterStories(mockStories, {
      selectedCountry: 'USA',
      selectedIndustry: 'Tech',
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Story 3');

    // Country: Japan + Industry: Retail -> None
    const resultNone = filterStories(mockStories, {
      selectedCountry: 'Japan',
      selectedIndustry: 'Retail',
    });
    expect(resultNone).toHaveLength(0);
  });
});
