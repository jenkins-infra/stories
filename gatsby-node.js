const {makeReactLayout, saveReactLayout} = require('./makeLayout');
const YAML = require('yaml');
const path = require('path');

exports.onPreBootstrap = async () => {
    await makeReactLayout('https://stories.jenkins.io').then(saveReactLayout);
};

async function createUserStoryPages({graphql, createPage}) {
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
        createPage({
            path: `/user-story/${edge.node.slug}/`,
            component: userStory,
            context: {
                id: edge.node.id,
                next: edge.next,
                previous: edge.previous,
            }
        });
    });
}

exports.createPages = async ({graphql, actions: {createPage}}) => {
    await createUserStoryPages({graphql, createPage});
};

exports.onCreateNode = async ({node, actions, loadNodeContent, createNodeId, createContentDigest}) => {
    const {createNode, createParentChildLink} = actions;

    if (node.internal.type === 'File') {
        if (node.base === 'index.yaml') {
            const content = await loadNodeContent(node);
            const obj = YAML.parse(content);
            obj.slug = path.basename(node.dir);

            const yamlNode = {
                ...obj,
                id: createNodeId(`${obj.slug} >>> UserStory`),
                children: [],
                parent: node.id,
                internal: {
                    type: 'UserStory',
                },
            };
            const paragraphs = obj.body.paragraphs;

            yamlNode.body.paragraphs = paragraphs.map((_, idx) => createNodeId(`${yamlNode.id} >>> ${idx} >>> MarkdownRemark`));
            yamlNode.internal.contentDigest = createContentDigest(yamlNode);

            createNode(yamlNode);
            createParentChildLink({parent: node, child: yamlNode});

            for (let i = 0; i < paragraphs.length; i++) {
                const markdownNode = {
                    id: yamlNode.body.paragraphs[i],
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
        }

        type UserStoryBody @dontinfer {
          title: String
          paragraphs: [MarkdownRemark] @link
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
