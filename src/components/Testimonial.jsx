import React from 'react';
import PropTypes from 'prop-types';
import './Testimonial.css';

const Testimonial = ({ from, image, children }) => {
  const [name, ...rest] = from.split(',');
  const title = rest.join(',').trim();

  return (
    <blockquote className="testimonial">
      <p className="testimonial-content">{children}</p>

      <footer className="testimonial-footer">
        {image ? (
          <img
            src={image}
            alt={name}
            className="testimonial-image"
            loading="lazy"
            width="60"
            height="60"
          />
        ) : null}

        <div className="testimonial-info">
          <span className="testimonial-name">{name}</span>

          {title ? <span className="testimonial-title">{title}</span> : null}
        </div>
      </footer>
    </blockquote>
  );
};

Testimonial.displayName = 'Testimonial';

Testimonial.propTypes = {
  from: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default Testimonial;
