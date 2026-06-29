export default {
  type: 'object',
  required: [
    'title',
    'date',
    'authored_by',
    'body_content',
    'metadata'
  ],
  additionalProperties: false,

  properties: {
    title: { type: 'string' },
    date: { type: 'string', format: 'date-time' },
    authored_by: { type: 'string' },
    post_name: { type: 'string' },
    tag_line: { type: 'string' },
    image: { type: 'string' },

    map: {
      type: 'object',
      additionalProperties: false,
      properties: {
        authored_by: { type: 'string' },
        location: { type: 'string' },
        industries: { type: 'array', items: { type: 'string' } },
        geojson: { type: 'string' },
      },
    },

    metadata: {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        organization: { type: 'string' },
        company: { type: 'string' },
        company_website: {
          oneOf: [
            { type: 'string', format: 'uri' },
            { type: 'array', items: { type: 'string', format: 'uri' } },
          ],
        },
        teams: { type: 'array', items: { type: 'string' } },
        team_members: { type: 'array', items: { type: 'string' } },
        project_website: { type: 'string', format: 'uri' },
        project_funding: { type: 'string' },
        funded_by: { type: 'string' },
        summary: { type: 'string' },
        industries: { type: 'array', items: { type: 'string' } },
        programming_languages: { type: 'array', items: { type: 'string' } },
        platforms: { type: 'array', items: { type: 'string' } },
        version_control_systems: { type: 'array', items: { type: 'string' } },
        build_tools: { type: 'array', items: { type: 'string' } },
        plugins: { type: 'array', items: { type: 'string' } },
        community_supports: { type: 'array', items: { type: 'string' } },
      },
    },

    body_content: {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: { type: 'string' },
        paragraphs: { type: 'array', items: { type: 'string' } },
      },
    },

    quotes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          from: { type: 'string' },
          content: { type: 'string' },
          image: { type: 'string' },
        },
      },
    },
  },
};
