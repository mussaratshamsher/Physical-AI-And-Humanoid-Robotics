import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureCardProps = {
  title: string;
  link: string;
  description: string;
  imageUrl?: string;
};

export default function FeatureCard({ title, link, description, imageUrl }: FeatureCardProps): React.JSX.Element {
  return (
    <div className={clsx('col col--4', styles.featureCard)}>
      <Link to={link} className="card">
        {imageUrl && (
          <div className="card__image">
            <img src={imageUrl} alt={title}/>
          </div>
        )}
        <div className="card__header">
          <h3>
            {title}
          </h3>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}
