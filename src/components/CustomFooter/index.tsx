import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import clsx from 'clsx'
import styles from './styles.module.css'

const CustomFooter = () => {
  const { siteConfig } = useDocusaurusContext()
  const year = new Date().getFullYear()

  return (
    <footer className={clsx(styles.footer)}>

      <div className={styles.container}>

        {/* LEFT - BRAND */}
        <div className={styles.brand}>
          <h3 className={styles.title}>{siteConfig.title}</h3>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
        </div>

        {/* CENTER - LINKS */}
        <div className={styles.links}>
          <Link to="/docs/intro">Getting Started</Link>
          <Link to="https://www.linkedin.com/in/mussarat-shamsher-7618a6380/" target='blank'>Linkedin</Link>
        </div>

        {/* RIGHT - SOCIAL */}
        <div className={styles.socials}>
          <Link
            href="https://github.com/mussaratshamsher/Physical-AI-And-Humanoid-Robotics"
            target="_blank"
          >
            GitHub
          </Link>

          
        </div>

      </div>

      {/* BOTTOM */}
      <div className={styles.bottom}>
        <p>
          © {year} {siteConfig.title}. All rights reserved.
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={styles.topBtn}
        >
          ↑ Top
        </button>
      </div>

    </footer>
  )
}

export default CustomFooter
