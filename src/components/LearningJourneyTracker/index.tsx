import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@docusaurus/router';
import { useUserData } from '../UserContext';
import styles from './styles.module.css';

// Define types for our learning journey
interface ChapterProgress {
  id: string;
  slug: string;
  title: string;
  timeSpent: number; // in seconds
  completed: boolean;
  viewed: boolean;
  lastViewed: number | null;
  currentSessionStartTime?: number; // Timestamp when user started viewing this chapter in current session
}

interface LearningJourneyData {
  progress: number;
  chapters: ChapterProgress[];
  totalChapters: number;
  completedChapters: number;
  totalTimeSpent: number;
  lastUpdated: number;
}

const CHAPTERS: Omit<ChapterProgress, 'timeSpent' | 'completed' | 'viewed' | 'lastViewed'>[] = [
  { id: 'intro', slug: '/docs/intro', title: 'Introduction' },
  { id: 'author', slug: '/docs/author', title: 'About the Author' },
  { id: 'intro-to-physical-ai', slug: '/docs/intro-to-physical-ai', title: 'Introduction to Physical AI' },
  { id: 'basics-of-humanoid-robotics', slug: '/docs/basics-of-humanoid-robotics', title: 'Basics of Humanoid Robotics' },
  { id: 'ros2-fundamentals-of-robotics', slug: '/docs/ros2-fundamentals-of-robotics', title: 'ROS2 Fundamentals of Robotics' },
  { id: 'vision-language-action-system', slug: '/docs/vision-language-action-system', title: 'Vision Language Action System' },
  { id: 'digital-twin-simulation', slug: '/docs/digital-twin-simulation', title: 'Digital Twin Simulation' },
  { id: 'capstone-project', slug: '/docs/capstone-project', title: 'Capstone Project' },
];

const LearningJourneyTracker = () => {
  const location = useLocation();
  const { userId } = useUserData();
  const [journeyData, setJourneyData] = useState<LearningJourneyData | null>(null);
  const [currentChapterTimer, setCurrentChapterTimer] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Calculate progress based on chapters completed and time spent
  const calculateProgress = useCallback((chapters: ChapterProgress[]): LearningJourneyData => {
    const totalChapters = chapters.length;
    const completedChapters = chapters.filter(chapter => chapter.completed).length;
    const totalTimeSpent = chapters.reduce((sum, chapter) => sum + chapter.timeSpent, 0);

    // Calculate progress based on time spent per chapter toward 5-minute goal
    // Each chapter has a 5-minute (300 seconds) target
    const timeBasedProgress = chapters.reduce((sum, chapter) => {
      // Calculate how much of the 5-minute goal has been reached (capped at 100%)
      const chapterProgress = Math.min(100, (chapter.timeSpent / 300) * 100);
      return sum + chapterProgress;
    }, 0);

    // Average progress across all chapters
    const averageTimeProgress = timeBasedProgress / totalChapters;

    // Calculate completion percentage (50% weight)
    const completionPercentage = (completedChapters / totalChapters) * 100;

    // Weighted combination: 60% for time-based progress, 40% for completion
    const progress = Math.round((averageTimeProgress * 0.6) + (completionPercentage * 0.4));

    return {
      progress: Math.min(100, progress), // Cap at 100%
      chapters,
      totalChapters,
      completedChapters,
      totalTimeSpent,
      lastUpdated: Date.now(),
    };
  }, []);

  // Load journey data from storage
  const loadJourneyData = useCallback(() => {
    if (!userId) return null;

    try {
      const stored = localStorage.getItem(`learning-journey-${userId}`);
      if (stored) {
        const data: LearningJourneyData = JSON.parse(stored);

        // Initialize any missing chapters
        const updatedChapters = CHAPTERS.map(chapter => {
          const existing = data.chapters.find(c => c.id === chapter.id);
          if (existing) {
            return {
              ...existing,
              // Update time spent for the current chapter if it's being tracked
              timeSpent: location.pathname.includes(chapter.slug) && currentChapterTimer > 0
                ? existing.timeSpent + currentChapterTimer
                : existing.timeSpent,
            };
          }
          return {
            ...chapter,
            timeSpent: 0,
            completed: false,
            viewed: false,
            lastViewed: null,
          };
        });

        return calculateProgress(updatedChapters);
      }
    } catch (error) {
      console.error('Error loading journey data:', error);
    }

    // Return default data if none exists
    const defaultChapters = CHAPTERS.map(chapter => ({
      ...chapter,
      timeSpent: 0,
      completed: false,
      viewed: false,
      lastViewed: null,
    }));

    return calculateProgress(defaultChapters);
  }, [userId, calculateProgress, location.pathname, currentChapterTimer]);

  // Save journey data to storage
  const saveJourneyData = useCallback((data: LearningJourneyData) => {
    if (!userId) return;

    try {
      localStorage.setItem(`learning-journey-${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving journey data:', error);
    }
  }, [userId]);

  // Update current chapter time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTracking && currentChapterTimer >= 0) {
      interval = setInterval(() => {
        setCurrentChapterTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, currentChapterTimer]);

  // Handle page navigation and tracking
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }

    // Save previous chapter data before navigating away
    if (journeyData) {
      const updatedChapters = journeyData.chapters.map(chapter => {
        if (chapter.viewed && currentChapterTimer > 0) {
          return {
            ...chapter,
            timeSpent: chapter.timeSpent + currentChapterTimer,
            // Mark as completed if spent more than 5 minutes on the page (configurable)
            completed: chapter.completed || currentChapterTimer >= 300,
          };
        }
        return chapter;
      });

      const updatedData = calculateProgress(updatedChapters);
      setJourneyData(updatedData);
      saveJourneyData(updatedData);
    }

    // Reset timer and start tracking for new chapter
    setCurrentChapterTimer(0);

    // Find the current chapter
    const currentChapter = CHAPTERS.find(chapter => location.pathname.includes(chapter.slug));

    if (currentChapter) {
      setIsTracking(true);

      // Update journey data to mark this chapter as viewed
      if (journeyData) {
        const updatedChapters = journeyData.chapters.map(chapter => {
          if (chapter.id === currentChapter.id) {
            return {
              ...chapter,
              viewed: true,
              lastViewed: Date.now(),
            };
          }
          return chapter;
        });

        const updatedData = calculateProgress(updatedChapters);
        setJourneyData(updatedData);
      }
    } else {
      setIsTracking(false);
    }
  }, [location.pathname, journeyData, currentChapterTimer, isMounted, calculateProgress, saveJourneyData]);

  // Initialize journey data
  useEffect(() => {
    if (userId) {
      const data = loadJourneyData();
      if (data) {
        setJourneyData(data);
      }
    }
  }, [userId, loadJourneyData]);

  // Save data when component unmounts
  useEffect(() => {
    return () => {
      if (journeyData && currentChapterTimer > 0) {
        const updatedChapters = journeyData.chapters.map(chapter => {
          if (chapter.viewed && currentChapterTimer > 0) {
            return {
              ...chapter,
              timeSpent: chapter.timeSpent + currentChapterTimer,
              completed: chapter.completed || currentChapterTimer >= 300,
            };
          }
          return chapter;
        });

        const updatedData = calculateProgress(updatedChapters);
        saveJourneyData(updatedData);
      }
    };
  }, [calculateProgress, saveJourneyData]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // For real-time updates, we'll calculate the current chapter progress in the render
  if (!journeyData) {
    return (
      <div className={styles.loadingState}>
        Loading your learning journey...
      </div>
    );
  }

  // Calculate the current chapter progress if tracking is active
  const currentChapterId = CHAPTERS.find(chapter => location.pathname.includes(chapter.slug))?.id;
  const updatedChapters = journeyData.chapters.map(chapter => {
    if (isTracking && currentChapterId === chapter.id) {
      return {
        ...chapter,
        timeSpent: chapter.timeSpent + currentChapterTimer,
      };
    }
    return chapter;
  });

  // Calculate the overall progress with the updated time for the current chapter
  const updatedProgressData = calculateProgress(updatedChapters);

  return (
    <div className={styles.learningJourneyTracker}>
      <h3>Your Learning Progress</h3>

      <div className={styles.progressSummary}>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${updatedProgressData.progress}%` }}
          />
        </div>
        <p className={styles.progressPercentage}>{updatedProgressData.progress}% complete</p>
      </div>

      <div className={styles.progressDetails}>
        <p>Chapters: {updatedProgressData.completedChapters} / {updatedProgressData.totalChapters} completed</p>
        <p>Total time spent: {formatTime(updatedProgressData.totalTimeSpent)}</p>
      </div>

      <div className={styles.chapterList}>
        <h4>Chapters</h4>
        <ul>
          {updatedProgressData.chapters.map((chapter, index) => {
            // Calculate progress for this chapter (5 minutes = 300 seconds)
            // If this is the current chapter and we're tracking, add the timer to the timeSpent
            let effectiveTimeSpent = chapter.timeSpent;
            if (isTracking && currentChapterId === chapter.id) {
              effectiveTimeSpent = chapter.timeSpent + currentChapterTimer;
            }
            const chapterProgress = Math.min(100, (effectiveTimeSpent / 300) * 100);
            const isCurrentChapter = location.pathname.includes(chapter.slug);

            return (
              <li
                key={chapter.id}
                className={styles.chapterItem}
              >
                <div className={styles.chapterHeader}>
                  <div className={styles.chapterTitle}>
                    <span className={`${styles.chapterStatus} ${chapter.completed ? styles.completed : ''}`}>
                      {chapter.completed ? '✅' : chapter.viewed ? (isCurrentChapter ? '⏳' : '📖') : '⚪'}
                    </span>
                    <span className={`${styles.chapterTitleText} ${isCurrentChapter ? styles.currentChapter : ''}`}>
                      {index + 1}. {chapter.title}
                    </span>
                  </div>
                  <div className={`${styles.chapterMetadata} ${chapter.completed ? styles.completed : ''}`}>
                    {formatTime(effectiveTimeSpent)}
                    {chapter.completed && <span>Completed</span>}
                  </div>
                </div>

                {/* Chapter-specific progress bar */}
                <div className={styles.chapterProgressContainer}>
                  <div
                    className={`${styles.chapterProgressBar}
                      ${chapter.completed ? styles.completed : ''}
                      ${isCurrentChapter ? styles.current : ''}
                      ${chapter.viewed && !isCurrentChapter ? styles.inProgress : styles.notStarted}`}
                    style={{ width: `${chapterProgress}%` }}
                  />
                  {/* Show progress percentage inside the bar when above 25% */}
                  {chapterProgress > 25 && (
                    <span className={styles.chapterProgressText}>
                      {Math.round(chapterProgress)}%
                    </span>
                  )}
                </div>

                {/* Progress details */}
                <div className={styles.chapterProgressDetails}>
                  {Math.round(chapterProgress)}% of 5 min goal • {formatTime(300 - Math.min(300, effectiveTimeSpent))} left
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LearningJourneyTracker;