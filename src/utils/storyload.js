const storyFiles = import.meta.glob('../user-story/**/index.yaml', {
  query: '?raw',
  import: 'default'
})

const slugFromPath = (path) =>
  path.replace('../user-story/', '').replace('/index.yaml', '') 

export const getStorySlugs = () => {
  return Object.keys(storyFiles).map(slugFromPath).sort()
}

export const getStoryStaticPaths = () => {
  return getStorySlugs().map((slug) => `/user-story/${slug}`)
}

const getStoryRaw = async (slug) => {
  const key = `../user-story/${slug}/index.yaml`  
  const loader = storyFiles[key]  

  if (!loader) {
    throw new Error(`Story not found: ${slug}`)
  }

  return await loader()
}

export const loadStoryData = async (slug) => {
  const raw = await getStoryRaw(slug) 

  const yaml = await import('js-yaml') 
  const data = yaml.load(raw) ?? {}  

  return {
    slug,
    title: data.title ?? '',
    authored_by: data.authored_by ?? data.author ?? ''
  }
}

export const loadUserStoryRouteData = async ({ params }) => {
  return await loadStoryData(params.slug)
}