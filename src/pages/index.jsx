import * as React from 'react';
import {useStaticQuery, graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import Layout from '../layout';
import Seo from '../components/Seo';


// markup
const IndexPage = () => {
    const title = 'Jenkins - User Story Library - All';
    const {stories} = useStaticQuery(graphql`query MyQuery {
        stories: allMdx(sort: {fields: frontmatter___date, order: DESC}) {
            edges {
                node {
                    frontmatter {
                        title
                        date
                        tag_line
                        image {
                            childImageSharp {
                                gatsbyImageData(layout: FIXED, width: 150)
                            }
                        }
                    }
                    slug
                }
            }
        }
    }`);

    return (
        <Layout title={title}>
            <Seo title={title} pathname="/" />
            <div className="container">
                <div className="row body">
                    <div className="col text-center">
                        <h1>Jenkins Is The Way</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h2>Tell Your Story</h2>
                        <p>&quot;Jenkins Is The Way&quot; is a global showcase of how developers and engineers are building, deploying, and automating great stuff with Jenkins.</p>
                        <p>Share your story and we’ll send you a free Jenkins Is The Way T-Shirt.</p>
                        <p>Our short form will capture details about your project’s goals and technical challenges, and the unique solutions you came up with using Jenkins.</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h2>Jenkins User Stories</h2>
                        {stories.edges.map(({node: story}) => (
                            <div key={story.slug} className="pb-2">
                                <div className="d-flex justify-content-right align-items-center">
                                    {story.frontmatter.image && <div><GatsbyImage image={getImage(story.frontmatter.image)} alt="Logo" className="mr-3" /></div>}
                                    <div>
                                        <div>
                                            <strong>
                                                {story.frontmatter.title}
                                            </strong>
                                        </div>
                                        <div>
                                            <small>{story.frontmatter.date}</small>
                                        </div>
                                        <div>
                                            {story.frontmatter.tag_line}
                                        </div>
                                        <div>
                                            <Link to={`/user-story/${story.slug}`}>Read More »</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default IndexPage;
