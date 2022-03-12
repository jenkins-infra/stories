const {makeReactLayout, saveReactLayout} = require('./makeLayout')
const path = require('path');

exports.onPreBootstrap = async () => {
  await makeReactLayout().then(saveReactLayout);
};

async function createUserStoryPages({graphql, createPage}) {
  const userStory = path.resolve('src/components/UserStory.jsx');
  const result = await graphql(`{
      allFile(filter: {sourceInstanceName: {eq: "user-stories"}, childMdx: {}, extension: {eq: "mdx"}}) {
        edges {
          node {
            childMdx {
              id
              slug
            }
          }
        }
      }
    }`);
  if (result.errors) {
    console.log(result.errors);
    throw result.errors;
  }

  result.data.allFile.edges.forEach(edge => {
    createPage({
      path: `/user-story/${edge.node.childMdx.slug.replace(/\/+$/, '')}/`,
      component: userStory,
      context: {
        id: edge.node.childMdx.id
      }
    });
  });
}
exports.createPages = async ({graphql, actions: {createPage}}) => {
  await createUserStoryPages({graphql, createPage})
};
