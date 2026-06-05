import React from 'react';
import PropTypes from 'prop-types';
import './Testimonial.css';

const Testimonial = ({ from, image, children }) => {
  return (
    <div className="testimonial pb-3">
      <blockquote>{children}</blockquote>
      <div className="attribution d-flex justify-content-center align-items-center">
        {image ? (
          <div>
            <img
              src={image}
              className="mr-3 rounded-circle"
              height="60"
              width="60"
              alt="profile picture"
              loading="lazy"
            />
          </div>
        ) : null}
        <div className="from mx-3 px-4 py-2">
          <span className="name">{from.split(',')[0]}</span>

          <span className="title">
            {from.split(',').slice(1).join(',').trim()}
          </span>
        </div>
      </div>
    </div>
  );
};

Testimonial.displayName = 'Testimonial';

Testimonial.propTypes = {
  from: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Testimonial;