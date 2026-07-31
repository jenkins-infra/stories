import { useLoaderData } from 'react-router-dom';
import React from 'react';
import Fuse from 'fuse.js';
import UserStoryCard from '../../components/user-story-card/UserStoryCard.jsx';
import jenkinsButler from '../../assets/Images/jenkins.svg';
import './All.css';

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

  return `https://github.com/jenkins-infra/stories/issues/new?template=success-story.yml`;
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
  const loaderStories = useLoaderData();
  const stories = React.useMemo(
    () => (Array.isArray(loaderStories) ? loaderStories : []),
    [loaderStories],
  );
  const storiesPerLoad = 10;
  const [displayCount, setDisplayCount] = React.useState(storiesPerLoad);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fuse = React.useMemo(() => {
    if (!Array.isArray(stories) || stories.length === 0) {
      return null;
    }

    return new Fuse(stories, {
      keys: [
        { name: 'title', weight: 0.55 },
        { name: 'tag_line', weight: 0.25 },
        { name: 'body_content.paragraphs', weight: 0.2 },
      ],
      threshold: 0.2,
      ignoreLocation: true,
      includeScore: false,
    });
  }, [stories]);

  const trimmedQuery = searchQuery.trim();

  const filteredStories = React.useMemo(() => {
    if (!trimmedQuery) {
      return stories;
    }

    if (!fuse) {
      return [];
    }

    return fuse.search(trimmedQuery).map(result => result.item);
  }, [fuse, trimmedQuery, stories]);

  const totalStories = filteredStories.length;
  const displayedStories = filteredStories.slice(0, displayCount);
  const showNoResults = trimmedQuery !== '' && totalStories === 0;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + storiesPerLoad);
  };

  return (
    <div id="all-page">
      <div className="all-page-container">
        <div className="all-page-row">
          <div className="all-page-col">
            <div className="all-page-tell-your-story">
              <div className="all-page-tell-your-story-media">
                <img
                  src={jenkinsButler}
                  alt="Jenkins butler mascot"
                  className="all-page-tell-your-story-image"
                />
              </div>
              <div className="all-page-tell-your-story-content">
                <h2>Tell Your Story</h2>
                <p>
                  "Jenkins Is The Way" is a global showcase of how developers
                  and engineers are building, deploying, and automating great
                  stuff with Jenkins. Share the story of your project's goals,
                  technical challenges, and the unique solutions you encountered
                  with Jenkins.
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
        </div>

        <div className="all-page-row">
          <h2 className="all-page-userstories-heading">Jenkins User Stories</h2>
          <div className="all-page-col all-page-search-wrapper">
            <input
              type="search"
              className="all-page-search-input"
              value={searchQuery}
              onChange={event => {
                setSearchQuery(event.target.value);
                setDisplayCount(10);
              }}
              placeholder="Search stories by title, tag, or keyword"
              aria-label="Search stories"
            />
          </div>
          <div className="all-page-col all-page-cards-wrapper">
            {showNoResults ? (
              <div className="all-page-no-results">
                No stories matched your search.
              </div>
            ) : (
              displayedStories.map(story => (
                <UserStoryCard
                  key={story.slug}
                  slug={story.slug}
                  image={story.image}
                  title={story.title}
                  date={story.date}
                  tag_line={story.tag_line}
                  body_content={story.body_content}
                />
              ))
            )}
          </div>
        </div>

        {displayCount < totalStories && (
          <div className="all-page-row">
            <div className="all-page-col all-page-text-center">
              <button
                onClick={handleLoadMore}
                className="all-page-load-more-btn"
              >
                Load More
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AllPage;
