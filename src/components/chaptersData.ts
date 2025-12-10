// Import images for optimization
import chap1Img from '@site/static/img/chap1.jpg';
import chap2Img from '@site/static/img/chap2.jpg';
import chap3Img from '@site/static/img/chap3.jpg';
import chap4Img from '@site/static/img/chap4.jpg';
import chap5Img from '@site/static/img/chap5.jpg';
import chap6Img from '@site/static/img/chap6.jpg';

export const chapterList = [
  {
    title: '1. Introduction to Physical AI',
    link: '/docs/intro-to-physical-ai',
    description: 'Start your journey into the world of AI that interacts with the physical world.',
    img: chap1Img,
  },
  {
    title: '2. Basics of Humanoid Robotics',
    link: '/docs/basics-of-humanoid-robotics',
    description: 'Learn the fundamental principles of humanoid robot design and locomotion.',
    img: chap2Img,
  },
  {
    title: '3. ROS 2 Fundamentals',
    link: '/docs/ros2-fundamentals-of-robotics',
    description: 'Explore the core concepts of the Robot Operating System 2 (ROS 2).',
    img: chap3Img,
  },
  {
    title: '4. Digital Twin Simulation',
    link: '/docs/digital-twin-simulation',
    description: 'Dive into creating and using digital twins with Gazebo and NVIDIA Isaac Sim.',
    img: chap4Img,
  },
  {
    title: '5. Vision-Language-Action Systems',
    link: '/docs/vision-language-action-system',
    description: 'Understand how robots can perceive, reason, and act based on multimodal inputs.',
    img: chap5Img,
  },
  {
    title: '6. Capstone Project',
    link: '/docs/capstone-project',
    description: 'Apply your knowledge to build a simple, end-to-end AI-robot pipeline.',
    img: chap6Img,
  },
];