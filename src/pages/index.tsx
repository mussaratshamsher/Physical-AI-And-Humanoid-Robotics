import React, { JSX } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import InfoSection from '@site/src/components/InfoSection';
import BookCover from '@site/src/components/BookCover';
import FeatureCard from '@site/src/components/FeatureCard';
import { chapterList } from '../components/chaptersData';

import styles from './index.module.css';
import hero from '../../static/img/hero.jpg';  

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header
      className={clsx(
        'hero hero--primary',
        styles.heroBanner,
        styles.heroBannerWithImage
      )}
    >
      {/* ✅ Background Image */}
      <img
        src={hero}
        className={styles.heroBannerImage}
        alt="Humanoid Robotics Hero"
        loading="eager"
        fetchPriority="high"
      />

      {/* ✅ Dark Overlay */}
      <div className={styles.heroOverlay} />

      {/* ✅ Foreground content */}
      <div className={clsx('container', styles.heroContent)}>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>

        <p className="hero__subtitle">{siteConfig.tagline}</p>

        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro-to-physical-ai"
          >
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="An AI-Native textbook on Physical AI & Humanoid Robotics"
    >
      <HomepageHeader />

      <BookCover />

      <main>
        <h2 className={styles.overviewHeading}>
          An overview of Physical AI & Humanoid Robotics
        </h2>

        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {chapterList.map(({ img, ...props }, idx) => (
                <FeatureCard key={idx} {...props} imageUrl={img} />
              ))}
            </div>
          </div>
        </section>

        <h2 className={styles.overviewHeading}>Know More About</h2>

        <InfoSection />
      </main>
    </Layout>
  );
}
