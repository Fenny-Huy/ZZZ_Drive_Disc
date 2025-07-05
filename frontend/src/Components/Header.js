import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../Styles/Components/Header.module.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/artifactcreate', label: 'Create', icon: '⚔️' },
    { path: '/artifact-list', label: 'List', icon: '📋' },
    { path: '/search-artifacts', label: 'Search', icon: '🔍' },
    { path: '/leveling-list', label: 'Leveling', icon: '📈' },
    { path: '/statistics', label: 'Stats', icon: '📊' },
    { path: '/substatistics', label: 'Analytics', icon: '📉' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_left}>
        <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
          <span className={styles.logo_icon}>⚡</span>
          ZZZ Drive Discs
        </Link>
      </div>
      
      <nav className={styles.header_right}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.nav_link} ${location.pathname === item.path ? styles.active : ''}`}
          >
            <span style={{ marginRight: '6px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <button 
        className={styles.mobile_menu_button}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      <nav className={`${styles.mobile_nav} ${isMobileMenuOpen ? styles.open : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.mobile_nav_link} ${location.pathname === item.path ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            <span style={{ marginRight: '8px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
