module.exports = {
  siteMetadata: {
    siteUrl: `https://theway.jenkins.io`,
    description: 'Jenkins is the way',
    twitter: '@jenkinsci',
  },
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: 'gatsby-plugin-matomo',
      options: {
        siteId: 'YOUR_SITE_ID',
        matomoUrl: 'jenkins-matomo.do.g4v.dev/',
        siteUrl: 'https://theway.jenkins.io'
      }
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        "icon": "src/images/icon.png"
      }
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          'user-stories': require.resolve("./src/layout.jsx"),
          //default: require.resolve("./src/components/default-page-layout.js"),
        },
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "./src/images/"
      },
      __key: "images"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "pages",
        "path": "./src/pages/"
      },
      __key: "pages"
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "user-stories",
        "path": "./src/user-story/"
      },
      __key: "user-stories"
    }
  ]
};
