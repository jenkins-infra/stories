def commonCustomEnvs = [
  // Added the below to fix permissions issue with the cache
  'GATSBY_CACHE_DIR=.gatsby-cache',
  'GATSBY_INTERNAL_CACHE_DIR=.cache',
  'GATSBY_TELEMETRY_DISABLED=1',
  'NODE_OPTIONS=--no-warnings',
]

buildWebsite([
  deployFolder: 'public',
  customEnvsDevelopment: commonCustomEnvs,
  customEnvsProduction: commonCustomEnvs,
])
