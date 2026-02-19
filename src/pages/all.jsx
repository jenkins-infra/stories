import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/Seo';
import UserStoryCard from '../components/UserStoryCard';
import './all.css';
import SearchContainer from '../components/SearchContainer.jsx';
// Function to generate the GitHub issue URL
function generateUserStoryIssueURL() {
  const queryParams = new URLSearchParams();
  queryParams.append('title', 'User Success Story');
  queryParams.append('labels', 'success-story');

  const bodyContent = `### Title  
_enter the title for your success story_

### Story Summary  
_give a short summary of your success story_

### _Next Steps_  
_After submitting this issue, please create a PR adding your full success story at:  \`/src/user-story/[story-title]/index.yaml\`  
Also, include any related images in the same directory._`;

  queryParams.append('body', bodyContent);

  return `https://github.com/jenkins-infra/stories/issues/new?${queryParams.toString()}`;
}

// Modal Component
const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Contribute Your Story</h2>
        <p>
          To share your Jenkins story, create an Issue and follow up with a Pull
          Request to the following GitHub repository:
        </p>
        <a
          href={generateUserStoryIssueURL()}
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          Share Your Story Now
        </a>
        <button onClick={onClose} className="close-btn">
          ✖
        </button>
      </div>
    </div>
  );
};

// Main page component
const AllPage = () => {
  const [displayCount, setDisplayCount] = React.useState(10); // Initial number of stories to display
  const storiesPerLoad = 10; // Number of stories to load each time
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const title = 'Jenkins - User Story Library - All';
  const { stories } = useStaticQuery(graphql`
    query AllStories {
      stories: allUserStory(sort: { date: DESC }) {
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
  const allStories = stories.edges;
  const totalStories = allStories.length;
  const displayedStories = allStories.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + storiesPerLoad);
  };

  return (
    <Layout title={title}>
      <Seo title={title} pathname="/all" />
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h1 className="textcolor">Jenkins Is The Way</h1>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="tell-your-story textcolor">
              <h2>Tell Your Story</h2>
              <p>
                "Jenkins Is The Way" is a global showcase of how developers and
                engineers are building, deploying, and automating great stuff
                with Jenkins. Share the story of your project's goals, technical
                challenges, and the unique solutions you encountered with
                Jenkins.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="share-story-btn"
              >
                Share Your Story
              </button>
            </div>
          </div>
        </div>
        {/* Search bar */}
        <div className="row">
          <h1
            style={{
              marginTop: `0.5em`,
              textAlign: `center`,
              fontWeight: 700,
              color: `var(--text-color)`,
            }}
          >
            Search Jenkins Stories
          </h1>
          <div>
            <SearchContainer />
          </div>
        </div>
        <div className="row">
          <h2 className="userstories-heading">Jenkins User Stories</h2>
          <div className="col cardsWrapper">
            {displayedStories.map(({ node: story }) => (
              <UserStoryCard
                key={story.slug}
                slug={story.slug}
                image={story.image}
                title={story.title}
                date={story.date}
                tag_line={story.tag_line}
              />
            ))}
          </div>
        </div>
        {displayCount < totalStories && (
          <div className="row">
            <div className="col text-center">
              <button onClick={handleLoadMore} className="load-more-btn">
                Load More
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
};

export default AllPage;
