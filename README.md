# Physical AI & Humanoid Robotics: An AI-Native Textbook

This repository contains the source code for the "Physical AI & Humanoid Robotics" AI-native textbook. The project's primary goal is to create a clean, modern, and professional online learning resource using Docusaurus.

## About the Project

The textbook is designed to be a concise and high-quality guide to the fundamentals of humanoid robotics and physical AI. It is organized into six chapters, covering everything from the basics of robotics to advanced topics like vision-language-action systems.

## Core Principles

- **Simplicity:** Prioritizing clarity and conciseness in both content and design.
- **Accuracy:** Ensuring all technical information is correct and up-to-date.
- **Minimalism:** Keeping the design and features to a minimum for a lightweight experience.
- **Fast Builds:** Optimizing for rapid build and deployment cycles.

## Tech Stack

- **Framework:** [Docusaurus](https://docusaurus.io/)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Yarn](https://yarnpkg.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd your-repository
    ```
3.  Install the dependencies:
    ```bash
    yarn
    ```

### Local Development

To start the local development server, run the following command:

```bash
yarn start
```

This will open a browser window with a live preview of the website. Most changes will be reflected automatically without needing to restart the server.

### Build

To build the static website for production, run:

```bash
yarn build
```

This command will generate the static files in the `build` directory.

## Deployment

This project is configured for seamless deployment with [Vercel](https://vercel.com/). Connect your GitHub repository to Vercel and it will automatically build and deploy the website whenever you push new changes.

The `vercel.json` file in the repository is configured to handle the build process.