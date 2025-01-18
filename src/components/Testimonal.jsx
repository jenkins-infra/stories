import React from 'react';
import PropTypes from 'prop-types';

import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import * as styles from './Testimonal.module.css';

const Testimonal = ({ from, image, children }) => {
  return (
    <div className={`${styles.root} pb-2`}>
      <blockquote>{children}</blockquote>
      <div
        className={`${styles.attribution} d-flex justify-content-center align-items-center`}
      >
        {image && (
          <div>
            <GatsbyImage
              image={getImage(image)}
              className="mr-3 rounded-circle"
              height="60"
              width="60"
              alt="profile picture"
            />
          </div>
        )}
        <div className="mr-2 ml-2">{from}</div>
      </div>
    </div>
  );
};

Testimonal.displayName = 'Testimonal';
Testimonal.propTypes = {
  from: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  image: PropTypes.shape({}),
};

export default Testimonal;
