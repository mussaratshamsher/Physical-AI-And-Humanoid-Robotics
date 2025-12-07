import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function BookCover() {
  return (
    <div className={styles.bookCoverContainer}>
      <h2 className={styles.title}>What this book covers</h2>
      <p>
        This book provides a comprehensive introduction to the exciting field of humanoid robotics. 
        You will learn about the fundamental principles of robotics, explore the intricacies of ROS2, 
        and delve into the world of digital twin simulations. The book also covers advanced topics like 
        vision-language-action systems and culminates in a capstone project to apply your knowledge.
      </p>
      <Link className="button button--primary button--lg" to="/docs/intro">
        Start Reading
      </Link>
    </div>
  );
}
