module.exports = {
    siteMetadata: {
        siteUrl: 'https://stories.jenkins.io',
        description: 'Jenkins is the way',
        twitter: '@jenkinsci',
    },
    plugins: [
        'gatsby-plugin-netlify-cms',
        'gatsby-plugin-image',
        'gatsby-remark-images',
        {
            resolve: 'gatsby-plugin-matomo',
            options: {
                matomoUrl: 'jenkins-matomo.do.g4v.dev',
                siteId: '2',
                siteUrl: 'https://stories.jenkins.io'
            }
        },
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sitemap',
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                'icon': 'src/images/icon.png'
            }
        },
        {
            resolve: 'gatsby-plugin-mdx',
            options: {
                gatsbyRemarkPlugins: [
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            maxWidth: 768,
                        },
                    },
                ],
            },
        },
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                'name': 'images',
                'path': './src/images/'
            },
            __key: 'images'
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                'name': 'pages',
                'path': './src/pages/'
            },
            __key: 'pages'
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                'name': 'user-stories',
                'path': './src/user-story/'
            },
            __key: 'user-stories'
        }
    ]
};
