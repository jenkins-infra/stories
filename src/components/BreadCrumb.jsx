import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import * as styles from './Breadcrumb.module.css';

const Breadcrumb = ({ currentPath, currentTitle }) => {
  const pathSegments = currentPath.split('/').filter(Boolean);
  return (
    <nav aria-label="breadcrumb" className={styles.nav}>
      <div className="container">
        <ol className={styles.list}>
          <li className={styles.item}>
            <Link to="/" className={`${styles.link} ${styles.home}`}>
              <ion-icon name="home-outline"></ion-icon>
            </Link>
          </li>
          {pathSegments.length > 0 && (
            <li className={styles.item}>
              <Link to="/all" className={styles.link}>
                {pathSegments[0].charAt(0).toUpperCase() +
                  pathSegments[0].slice(1).replace(/-/g, ' ')}
              </Link>
            </li>
          )}
          {currentTitle && (
            <li className={`${styles.item} ${styles.current}`}>
              {currentTitle}
            </li>
          )}
        </ol>
      </div>
    </nav>
  );
};

Breadcrumb.propTypes = {
  currentPath: PropTypes.string.isRequired,
  currentTitle: PropTypes.string,
};

export default Breadcrumb;
