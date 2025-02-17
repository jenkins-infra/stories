import React from 'react';
import * as styles from './StatsCard.module.css';

const StatBox = ({ value, label }) => (
  <div className={styles.statBox}>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statLabel}>{label}</div>
  </div>
);

const StatsCard = ({ totalStories, uniqueLocations, uniqueIndustries }) => {
  return (
    <div className={`${styles.statsCard} bg-dark`}>
      <div className={styles.statsContainer}>
        <StatBox value={totalStories} label="Stories" />
        <StatBox value={uniqueLocations} label="Locations" />
        <StatBox value={uniqueIndustries} label="Industries" />
      </div>
    </div>
  );
};

export default StatsCard;
