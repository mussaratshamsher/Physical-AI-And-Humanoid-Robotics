import React, { JSX } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import FeatureCard from '@site/src/components/FeatureCard';
import Heading from '@theme/Heading';

import InfoSection from '@site/src/components/InfoSection';
import BookCover from '@site/src/components/BookCover';

import styles from './index.module.css';

const chapterList = [
  {
    title: '1. Introduction to Physical AI',
    link: '/docs/intro-to-physical-ai',
    description: 'Start your journey into the world of AI that interacts with the physical world.',
    imageUrl: require('@site/static/img/chap1.jpg').default,
  },
  {
    title: '2. Basics of Humanoid Robotics',
    link: '/docs/basics-of-humanoid-robotics',
    description: 'Learn the fundamental principles of humanoid robot design and locomotion.',
    imageUrl: require('@site/static/img/chap2.jpg').default,
  },
  {
    title: '3. ROS 2 Fundamentals',
    link: '/docs/ros2-fundamentals-of-robotics',
    description: 'Explore the core concepts of the Robot Operating System 2 (ROS 2).',
    imageUrl: require('@site/static/img/chap3.jpg').default,
  },
  {
    title: '4. Digital Twin Simulation',
    link: '/docs/digital-twin-simulation',
    description: 'Dive into creating and using digital twins with Gazebo and NVIDIA Isaac Sim.',
    imageUrl: require('@site/static/img/chap4.jpg').default,
  },
  {
    title: '5. Vision-Language-Action Systems',
    link: '/docs/vision-language-action-system',
    description: 'Understand how robots can perceive, reason, and act based on multimodal inputs.',
    imageUrl: require('@site/static/img/chap5.jpg').default,
  },
  {
    title: '6. Capstone Project',
    link: '/docs/capstone-project',
    description: 'Apply your knowledge to build a simple, end-to-end AI-robot pipeline.',
    imageUrl: require('@site/static/img/chap6.jpg').default,
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner, styles.heroBannerWithImage)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Reading
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="An AI-Native textbook on Physical AI & Humanoid Robotics">
      <HomepageHeader />
      <BookCover />
      <main>
      <h1 className={styles.overviewHeading}>An overview of Physical AI & Humanoid Robotics</h1>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {chapterList.map((props, idx) => (
                <FeatureCard key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      <h1 className={styles.overviewHeading}>Know More About</h1>

        <InfoSection />
      </main>
    </Layout>
  );
}
