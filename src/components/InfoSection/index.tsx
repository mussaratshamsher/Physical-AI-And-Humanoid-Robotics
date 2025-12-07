import React from 'react';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

const InfoSection = () => {
  return (
    <div className={styles.infoSection}>
      <div className="container">
        <div className="row">
          {/* About the Book */}
          <div className="col col--4">
            <div className={styles.infoCard}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.5m0 0a2.498 2.498 0 01-2.498-2.498v-6.5a2.498 2.498 0 012.498-2.498z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253h6.5a2.498 2.498 0 012.498 2.498v6.5a2.498 2.498 0 01-2.498 2.498H12m0 0a2.498 2.498 0 00-2.498 2.498v-6.5a2.498 2.498 0 002.498-2.498z" />
              </svg>
              <h3 className={styles.title}>About the Book</h3>
              <ul className={styles.propertyList}>
                <li>AI-Native Textbook</li>
                <li>Interactive Content</li>
                <li>Open Source</li>
                <li>Community Driven</li>
              </ul>
            </div>
          </div>

          {/* Community & Contributions */}
          <div className="col col--4">
            <div className={styles.infoCard}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H10c-1.26 0-2.43.33-3.444.908M9 12V3a1 1 0 00-1-1H3a1 1 0 00-1 1v9m5 0a7 7 0 100 14h12a7 7 0 000-14H7zM7 12a3 3 0 00-3-3H2" />
              </svg>
              <h3 className={styles.title}>Community & Contributions</h3>
              <p>
                This textbook is open-source and community-driven. Your contributions are welcome!
              </p>
              <Link className="button button--secondary button--sm" to="/docs/community-contributions">
                Learn How to Contribute
              </Link>
            </div>
          </div>

          {/* About the Author */}
          <div className="col col--4">
            <Link to="/docs/author" className={styles.infoCardLink}>
              <div className={styles.infoCard}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className={styles.title}>About the Author</h3>
                <p>
                  Learn more about the author, Mussarat Shamsher.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;