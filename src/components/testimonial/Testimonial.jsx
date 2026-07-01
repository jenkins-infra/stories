import PropTypes from 'prop-types';
import './Testimonial.css';

const Testimonial = ({ from, image, children }) => {
  return (
    <div className="testimonial pb-3">
      <blockquote>{children}</blockquote>
      <div className="attribution">
        {image && (
          <div className="avatar">
            <img
              src={image}
              alt="profile picture"
              loading="lazy"
            />
          </div>
        )}
        <div className="from">
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
