import PropTypes from 'prop-types';

import './Testimonal.css';

const Testimonal = ({ from, image, children }) => {
  return (
    <div className="testimonialRoot pb-3">
      <blockquote>{children}</blockquote>

      <div className="testimonialAttribution d-flex justify-content-center align-items-center">
        {image && (
          <div>
            <img
              src={image}
              alt="profile picture"
              className="testimonialImage mr-3 rounded-circle"
              loading="lazy"
              width="60"
              height="60"
            />
          </div>
        )}

        <div className="testimonialFrom mx-3 px-4 py-2">
          <span className="testimonialName">
            {from.split(',')[0]}
          </span>

          <br />

          <span className="testimonialTitle">
            {from.split(',').slice(1).join(',').trim()}
          </span>
        </div>
      </div>
    </div>
  );
};

Testimonal.displayName = 'Testimonal';

Testimonal.propTypes = {
  from: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default Testimonal;