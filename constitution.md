# [Project]
Name: "Physical AI & Humanoid Robotics"
Type: "AI-Native Textbook"

# [Purpose]
The primary purpose of this project is to create a short, clean, and professional AI-Native textbook based on the "Physical AI & Humanoid Robotics" course. The textbook must serve as a fast, simple, and high-quality learning resource, presented through a modern Docusaurus UI and enhanced with AI-powered interactive features.

# [Scope]
The project scope is defined by the following components:

## Content:
A concise textbook consisting of six chapters:
1. Introduction to Physical AI
2. Basics of Humanoid Robotics
3. ROS 2 Fundamentals
4. Digital Twin Simulation (Gazebo + Isaac)
5. Vision-Language-Action Systems
6. Capstone: Simple AI-Robot Pipeline

## User Interface:
- A clean, minimalist, and professional UI built on Docusaurus.
- The design should prioritize readability and ease of navigation.

## Interactive Features:
- **RAG Chatbot:** An AI-based chat assistant trained on the book's content to answer user questions.
- **Content Translation:** An on-demand feature to translate chapter content into different languages.
- **Personalization:** A system to quiz users on their interests and highlight relevant content within the textbook.
- **Enhanced Search:** Integration of a powerful search tool for quick content discovery.

# [Core Principles]
All work on this project must adhere to the following principles:
- **Phased Development:** Implement features in logical phases: first the core backend (RAG), then frontend integration, and finally advanced features.
- **Modularity:** Develop features like the chatbot, translation, and personalization as distinct, decoupled components.
- **Simplicity & Minimalism:** Prioritize clarity in content and design. Avoid unnecessary complexity to ensure a lightweight and focused experience.
- **Accuracy:** Ensure all technical information is correct and up-to-date.
- **Fast Builds:** Optimize for rapid build and deployment cycles.

# [Key Features]
- Docusaurus-based textbook structure.
- **RAG-based Chatbot** for interactive learning.
- **On-demand content translation**.
- **Personalized content highlighting** based on user interests.
- Integration with **Algolia DocSearch** for fast, conventional search.
- Seamless deployment and continuous integration with Vercel.
- A modern, customized UI for an enhanced reading experience.

# [Constraints]
- **Free-Tier First:** All technologies and services must operate within their respective free tiers (Vercel, Qdrant Cloud, Google AI).
- **No Heavy GPU Usage:** The final product and development workflow must not require heavy GPU resources.
- **Minimal Embeddings:** Use embeddings efficiently to align with free-tier limitations and performance goals.

# [Success Criteria]
The project will be considered successful upon meeting the following criteria:
- **Build Success:** The Docusaurus project builds without errors.
- **Functional Chatbot:** The chatbot is integrated into the UI and accurately answers questions based on the book's content.
- **Functional Translation:** The translation feature works on chapter pages.
- **Functional Personalization:** The interest quiz correctly highlights relevant content.
- **Clean UI:** The final textbook has a polished, professional, and uncluttered user interface.
- **Smooth Vercel Deployment:** The project, including the FastAPI backend, is successfully deployed to a public Vercel URL.
- **Content Completion:** All original six chapters are written and published.

# [Style and Conventions]
- **Code:** Adhere to standard formatting and linting rules for Python, TypeScript, and React. Maintain a clean and organized codebase.
- **Content:** Write in a clear, professional, and accessible tone suitable for a technical textbook. Use Markdown for all content.
- **UI:** The UI should be modern, responsive, and consistent with the minimalist aesthetic.

# [Tools and Technologies]
- **Frontend Framework:** Docusaurus (React)
- **Backend Framework:** FastAPI (Python)
- **Vector Database:** Qdrant (Cloud)
- **LLM / Embeddings:** Google Gemini (via Google AI)
- **Search:** Algolia DocSearch
- **Deployment:** Vercel
- **Simulation (for content):** Gazebo, NVIDIA Isaac Sim
- **Robotics Framework (for content):** ROS 2
