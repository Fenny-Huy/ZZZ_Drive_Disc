// src/Pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Pages/HomePage.module.css';

const HomePage = () => {
  const features = [
    {
      icon: '⚔️',
      title: 'Create Drive Disc',
      description: 'Add new Drive Discs to your collection with detailed attributes and effects',
      link: '/artifactcreate'
    },
    {
      icon: '📋',
      title: 'Drive Disc List',
      description: 'View and manage all your Drive Discs in an organized table',
      link: '/artifact-list'
    },
    {
      icon: '🔍',
      title: 'Search Drive Discs',
      description: 'Find specific Drive Discs using advanced filtering options',
      link: '/search-artifacts'
    },
    {
      icon: '📈',
      title: 'Upgrade Progress',
      description: 'Track and manage your Drive Disc upgrade progress',
      link: '/leveling-list'
    },
    {
      icon: '📊',
      title: 'Statistics',
      description: 'Analyze your Drive Disc collection with detailed statistics',
      link: '/statistics'
    },
    {
      icon: '📉',
      title: 'Advanced Analytics',
      description: 'Deep dive into effect distributions and optimization analysis',
      link: '/substatistics'
    }
  ];

  return (
    <div className={styles.homepage_container}>
      <div className={styles.hero_section}>
        <h1 className={styles.main_title}>Zenless Zone Zero Drive Discs</h1>
        <p className={styles.subtitle}>
          Your comprehensive Drive Disc management system for Zenless Zone Zero. 
          Track, analyze, and optimize your Drive Disc collection with powerful tools and insights.
        </p>
      </div>

      <div className={styles.features_grid}>
        {features.map((feature, index) => (
          <Link 
            key={index}
            to={feature.link} 
            className={styles.feature_card}
          >
            <span className={styles.feature_icon}>{feature.icon}</span>
            <h3 className={styles.feature_title}>{feature.title}</h3>
            <p className={styles.feature_description}>{feature.description}</p>
          </Link>
        ))}
      </div>

      <div className={styles.cta_section}>
        <Link to="/artifactcreate" className={styles.primary_button}>
          ✨ Start Managing Discs
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
