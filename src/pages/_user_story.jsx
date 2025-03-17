import { graphql, Link } from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layout';
import Seo from '../components/Seo';
import UserStory from '../components/UserStory';
import Breadcrumb from '../components/BreadCrumb';

const UserStoryPage = ({ data: { userStory: page }, pageContext }) => {
  const title = page.title;
  const currentPath = `/user-story/${page.slug}`;
  const StoryLink = ({ direction, story }) => (
    <Link
      className={`nav-link text-secondary fw-medium d-flex align-items-center gap-1 h-100`}
      to={`/user-story/${story.slug}`}
      style={{
        minHeight: '3.5rem',
        padding: '0.25rem',
      }}
    >
      {direction === 'prev' && (
        <ion-icon
          name="arrow-back-outline"
          class="fs-5 flex-shrink-0"
        ></ion-icon>
      )}
      <span
        className="small"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textAlign: direction === 'prev' ? 'left' : 'right',
          flex: 1,
        }}
      >
        {story.title.replace(/^jenkins is the way to/i, '')}
      </span>
      {direction === 'next' && (
        <ion-icon
          name="arrow-forward-outline"
          class="fs-5 flex-shrink-0"
        ></ion-icon>
      )}
    </Link>
  );

  return (
    <Layout
      title={title}
      sourcePath={`src/user-story/${page.parent.relativePath}`}
    >
      <Seo title={title} pathname={`/user-story/${page.slug}`} />
      <nav className="navbar navbar-expand bg-dark py-1">
        <div className="container-fluid px-1">
          <div className="row w-100 justify-content-between align-items-center mx-0">
            {/* Previous Story */}
            <div className="col-5">
              {pageContext.previous && (
                <StoryLink direction="prev" story={pageContext.previous} />
              )}
            </div>

            {/* Next Story */}
            <div className="col-5 ms-auto text-end">
              {pageContext.next && (
                <StoryLink direction="next" story={pageContext.next} />
              )}
            </div>
          </div>
        </div>
      </nav>
      <Breadcrumb currentPath={currentPath} currentTitle={title} />

      <UserStory {...page} />
    </Layout>
  );
};

UserStoryPage.displayName = 'UserStoryPage';
UserStoryPage.propTypes = {
  pageContext: PropTypes.shape({
    previous: PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
    next: PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
  }),
  data: PropTypes.shape({
    userStory: PropTypes.object.isRequired,
  }),
};

export default UserStoryPage;

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query UserStoryBySlug($id: String!) {
    userStory(id: { eq: $id }) {
      parent {
        ... on File {
          relativePath
        }
      }
      slug
      date
      post_name
      authored_by
      tag_line
      title
      image {
        childImageSharp {
          gatsbyImageData(layout: FIXED, width: 300)
        }
      }
      quotes {
        from
        image {
          childImageSharp {
            gatsbyImageData(layout: FIXED, width: 60, height: 60)
          }
        }
        content
      }
      metadata {
        title
        build_tools
        community_supports
        company
        company_website
        industries
        organization
        platforms
        plugins
        programming_languages
        project_website
        project_funding
        summary
        version_control_systems
        team_members
      }
      body_content {
        title
        paragraphs {
          html
        }
      }
    }
  }
`;
