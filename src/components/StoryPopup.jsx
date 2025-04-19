import React from 'react';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';

const StoryPopup = ({ story }) => {
  return (
    <div className="story-popup">
      {story.image && (
        <div className="story-popup-image">
          <GatsbyImage
            image={getImage(story.image)}
            alt={`Thumbnail for ${story.title}`}
            className="story-img"
          />
        </div>
      )}

      <div className="story-popup-title">{story.title}</div>

      <div className="story-popup-details">
        <div className="story-popup-row">
          <span className="story-popup-label">Author:</span>
          <span className="story-popup-value">
            {story.map.authored_by || story.authored_by}
          </span>
        </div>

        <div className="story-popup-row">
          <span className="story-popup-label">Location:</span>
          <span className="story-popup-value">{story.map.location}</span>
        </div>

        {story.metadata?.industries && (
          <div className="story-popup-row">
            <span className="story-popup-label">Industries:</span>
            <span className="story-popup-value">
              {story.metadata.industries.join(', ')}
            </span>
          </div>
        )}
      </div>

      <div className="story-btn-container">
        <Link
          to={`/user-story/${story.slug}`}
          className="story-popup-button"
          aria-label={`Read the full story about ${story.title}`}
        >
          Read Story
        </Link>
      </div>
    </div>
  );
};

StoryPopup.propTypes = {
  story: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    authored_by: PropTypes.string,
    image: PropTypes.object,
    map: PropTypes.shape({
      authored_by: PropTypes.string,
      location: PropTypes.string.isRequired,
    }).isRequired,
    metadata: PropTypes.shape({
      organization: PropTypes.string,
      industries: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
};

export default StoryPopup;
