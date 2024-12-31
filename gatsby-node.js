const YAML = require('yaml');
const path = require('path');

async function createUserStoryPages({graphql, createPage, createRedirect}) {
    const userStory = path.resolve('src/pages/_user_story.jsx');
    const result = await graphql(`{
        stories: allUserStory {
            edges {
                node {
                    id
                    slug
                }
                next {
                    title
                    slug
                }
                previous {
                    title
                    slug
                }
            }
        }
    }`);

    if (result.errors) {
        console.error(result.errors);
        throw result.errors;
    }

    result.data.stories.edges.forEach(edge => {
        if (!edge.node.slug.startsWith('jenkins-is-the-way-')) {
            // Handle any URLs that previously had jenkins-is-the-way in the URL
            createRedirect({
                fromPath: `/user-story/jenkins-is-the-way-${edge.node.slug}/`,
                toPath: `/user-story/${edge.node.slug}/`,
                isPermanent: true,
            });
        }
        createPage({
            path: `/user-story/${edge.node.slug}/`,
            component: userStory,
            context: {
                id: edge.node.id,
                next: edge.next ? {title: edge.next.title, slug: edge.next.slug} : null,
                previous: edge.previous ? {title: edge.previous.title, slug: edge.previous.slug} : null,
            }
        });
    });
}

exports.createPages = async ({graphql, actions: {createPage, createRedirect}}) => {
    await createUserStoryPages({graphql, createPage, createRedirect});
};

exports.onCreateNode = async ({node, actions, loadNodeContent, createNodeId, createContentDigest}) => {
    const {createNode, createParentChildLink} = actions;

    if (node.internal.type === 'File') {
        if (node.base === 'index.yaml') {
            const content = await loadNodeContent(node);
            const obj = YAML.parse(content);
            obj.slug = path.basename(node.dir);

            // Move fields from map to metadata and remove redundant fields
            if (obj.map) {
                if (!obj.metadata) {
                    obj.metadata = {};
                }

                const mapFields = ['authored_by', 'location', 'industries', 'latitude', 'longitude'];
                mapFields.forEach(field => {
                    if (obj.map[field]) {
                        obj.metadata[field] = obj.map[field];
                        delete obj.map[field]; // Clean up the map object
                    }
                });
            }

            // Ensure authored_by field is correctly set
            if (obj.metadata.authored_by) {
                const uniqueNames = new Set(obj.metadata.authored_by.split(', ').map(name => name.trim()));
                obj.metadata.authored_by = Array.from(uniqueNames).join(', ');
            }

            const yamlNode = {
                ...obj,
                id: createNodeId(`${obj.slug} >>> UserStory`),
                children: [],
                parent: node.id,
                internal: {
                    type: 'UserStory',
                },
            };
            const paragraphs = obj.body_content.paragraphs;

            yamlNode.body_content.paragraphs = paragraphs.map((_, idx) => createNodeId(`${yamlNode.id} >>> ${idx} >>> MarkdownRemark`));
            yamlNode.internal.contentDigest = createContentDigest(yamlNode);

            createNode(yamlNode);
            createParentChildLink({parent: node, child: yamlNode});

            for (let i = 0; i < paragraphs.length; i++) {
                const markdownNode = {
                    id: yamlNode.body_content.paragraphs[i],
                    frontmatter: {},
                    excerpt: '',
                    rawMarkdownBody: paragraphs[i],
                    fileAbsolutePath: node.absolutePath,
                    children: [],
                    parent: yamlNode.id,
                    internal: {
                        content: paragraphs[i],
                        type: 'MarkdownRemark',
                    },
                };
                markdownNode.internal.contentDigest = createContentDigest(markdownNode);
                createNode(markdownNode);
                createParentChildLink({parent: yamlNode, child: markdownNode});
                createParentChildLink({parent: node, child: markdownNode});
            }
        }
    }
};

exports.createSchemaCustomization = ({actions: {createTypes}}) => {
    createTypes(`
        type UserStoryMetadata {
            build_tools: [String]
            community_supports: [String]
            company: String
            company_website: String
            industries: [String]
            organization: String
            platforms: [String]
            plugins: [String]
            programming_languages: [String]
            project_funding: String
            project_website: String
            summary: String
            team_members: [String]
            version_control_systems: [String]
            authored_by: String
            location: String
            latitude: String
            longitude: String
        }

        type UserStoryBody_content @dontinfer {
            title: String
            paragraphs: [MarkdownRemark] @link
        }

        type UserStoryMap {
            location: String
            industries: [String]
            authored_by: String
            latitude: String
            longitude: String
        }

        type UserStory implements Node {
            id: ID!
            slug: String!
            metadata: UserStoryMetadata
            body_content: UserStoryBody_content
            map: UserStoryMap
            next: UserStory
            previous: UserStory
        }
    `);
};

exports.onCreateWebpackConfig = ({stage, loaders, actions}) => {
    if (stage === 'build-html') {
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: /leaflet/,
                        use: loaders.null(),
                    },
                ],
            },
        });
    }
};
