import * as React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Layout from '../layout';
import Seo from '../components/Seo';
import { Calendar } from 'lucide-react';

// markup
const AllPage = () => {
  const title = 'Jenkins - User Story Library - All';
  const { stories } = useStaticQuery(graphql`
    query AllStories {
      stories: allUserStory(sort: { fields: date, order: DESC }) {
        edges {
          node {
            title
            date(formatString: "dddd DD MMMM YYYY")
            tag_line
            image {
              childImageSharp {
                gatsbyImageData(layout: FIXED, width: 150)
              }
            }
            slug
          }
        }
      }
    }
  `);

  return (
    <Layout title={title}>
      <Seo title={title} pathname="/all" />
      <div className="container">
        <div className="row body">
          <div className="col text-center">
            <h1>Jenkins Is The Way</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2>Tell Your Story</h2>
            <p>
              &quot;Jenkins Is The Way&quot; is a global showcase of how
              developers and engineers are building, deploying, and automating
              great stuff with Jenkins.
            </p>
            <p>
              Share your story and we'll send you a free Jenkins Is The Way
              T-shirt.
            </p>
            <p>
              <a href="/admin/#/collections/user-story">Share the story</a> of
              your project's goals, technical challenges, and the unique
              solutions you encountered with Jenkins.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2 className="pb-2">Jenkins User Stories</h2>
            {stories.edges.map(({ node: story }) => (
              <div
                key={story.slug}
                className="mb-4 border border-slate-700 rounded-4 px-4"
              >
                <div className="d-flex justify-content-right align-items-center">
                  {story.image && (
                    <div>
                      <Link to={`/user-story/${story.slug}`}>
                        <GatsbyImage
                          image={getImage(story.image)}
                          alt="Logo"
                          className="h-[150px] w-[150px] rounded-2"
                        />
                      </Link>
                    </div>
                  )}
                  <div className="m-4">
                    <div className="text-xl fw-semibold fs-4">
                      <Link to={`/user-story/${story.slug}`}>
                        {story.title}
                      </Link>
                    </div>
                    <div>
                      <Calendar size={15} className="inline-block" />
                      <small className="p-2 text-secondary">{story.date}</small>
                    </div>
                    <div className="mt-3">{story.tag_line}</div>
                    <div className="mt-2">
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

export default AllPage;
