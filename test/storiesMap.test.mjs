import test from 'node:test';
import assert from 'node:assert/strict';

import {
  extractCountry,
  groupStoriesByCountry,
  filterStories,
  getCenterForCountry,
} from '../src/utils/storiesMap.mjs';

const stories = [
  {
    id: '1',
    map: {
      location: 'Paris, France',
      geojson: JSON.stringify({ type: 'Point', coordinates: [2.3522, 48.8566] }),
    },
    metadata: { industries: ['Finance'] },
  },
  {
    id: '2',
    map: {
      location: 'Lyon, France',
      geojson: JSON.stringify({ type: 'Point', coordinates: [4.8357, 45.764] }),
    },
    metadata: { industries: ['Retail'] },
  },
  {
    id: '3',
    map: {
      location: 'Berlin, Germany',
      geojson: JSON.stringify({ type: 'Point', coordinates: [13.405, 52.52] }),
    },
    metadata: { industries: ['Finance'] },
  },
];

test('extractCountry extracts trailing country from location', () => {
  assert.equal(extractCountry('Paris, France'), 'France');
  assert.equal(extractCountry('France'), 'France');
  assert.equal(extractCountry(''), 'Unknown');
});

test('groupStoriesByCountry groups stories by extracted country', () => {
  const grouped = groupStoriesByCountry(stories);
  assert.equal(grouped.France.length, 2);
  assert.equal(grouped.Germany.length, 1);
});

test('filterStories supports country, industry, and prefix search', () => {
  const byCountry = filterStories(stories, { selectedCountry: 'France' });
  assert.equal(byCountry.length, 2);

  const byIndustry = filterStories(stories, { selectedIndustry: 'Retail' });
  assert.equal(byIndustry.length, 1);
  assert.equal(byIndustry[0].id, '2');

  const byPrefix = filterStories(stories, { searchQuery: 'ger' });
  assert.equal(byPrefix.length, 1);
  assert.equal(byPrefix[0].id, '3');
});

test('getCenterForCountry averages valid geojson points and ignores malformed entries', () => {
  const center = getCenterForCountry([
    stories[0],
    stories[1],
    { map: { geojson: '{invalid json}' } },
  ]);

  assert.ok(center);
  assert.equal(center.length, 2);
  assert.equal(Number(center[0].toFixed(4)), 47.3103);
  assert.equal(Number(center[1].toFixed(4)), 3.5939);
});
