import { useLoaderData } from 'react-router-dom';
import React from 'react';
import UserStoryCard from '../../components/UserStoryCard';
import './allstory.css';

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

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="all-page-modal-overlay">
      <div className="all-page-modal-content">
        <h2>Contribute Your Story</h2>
        <p>
          To share your Jenkins story, create an Issue and follow up with a Pull
          Request to the following GitHub repository:
        </p>
        <a
          href={generateUserStoryIssueURL()}
          target="_blank"
          rel="noopener noreferrer"
          className="all-page-github-link"
       >
          Share Your Story Now
        </a>
        <button onClick={onClose} className="all-page-close-btn">
          ✖
        </button>
      </div>
    </div>
  );
};

const AllPage = () => {
  const stories = useLoaderData() ?? [];
  const [displayCount, setDisplayCount] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const storiesPerLoad = 10;

  const totalStories = stories.length;
  const displayedStories = stories.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + storiesPerLoad);
  };

  return (
    <div id="all-page">
      <jio-navbar property="https://vite-stories-jenkins.netlify.app/" />

      <div className="all-page-container">
        <div className="all-page-row">
          <div className="all-page-col all-page-text-center">
            <h1>Jenkins Is The Way</h1>
          </div>
        </div>

        <div className="all-page-row">
          <div className="all-page-col">
            <div className="all-page-tell-your-story">
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
                className="all-page-share-story-btn"
              >
                Share Your Story
              </button>
            </div>
          </div>
        </div>

        <div className="all-page-row">
          <h2 className="all-page-userstories-heading">Jenkins User Stories</h2>
          <div className="all-page-col all-page-cards-wrapper">
            {displayedStories.map(story => (
              <UserStoryCard
                key={story.slug}
                slug={story.slug}
                image={story.image}
                title={story.title}
                date={story.date}
                tag_line={story.tag_line}
                body_content={story.body_content}
              />
            ))}
          </div>
        </div>

        {displayCount < totalStories && (
          <div className="all-page-row">
            <div className="all-page-col all-page-text-center">
              <button onClick={handleLoadMore} className="all-page-load-more-btn">
                Load More
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <jio-footer property="https://vite-stories-jenkins.netlify.app/" />
    </div>
  );
};

export default AllPage;