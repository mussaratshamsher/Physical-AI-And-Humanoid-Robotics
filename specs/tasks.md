# Phase- 1
---
description: "Task list for implementing the AI-Native Textbook UI & Layout"
---

# Tasks: AI-Native Textbook UI & Layout

**Input**: Design documents from `./plan.md`
**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify Docusaurus project structure is in place.
- [ ] T002 Ensure all dependencies are installed (`npm install`).

---

## Phase 2: User Story 1 - Homepage (Priority: P1) 🎯 MVP

**Goal**: Create a homepage that displays a hero section and a grid of six feature cards, one for each chapter.

**Independent Test**: Run the development server (`npm start`) and verify that the homepage renders correctly with the hero text and the six chapter cards.

### Implementation for User Story 1

- [ ] T003 [P] [US1] Create the `FeatureCard.tsx` component in `src/components/`. This component should accept `title`, `link`, and `description` as props.
- [ ] T004 [P] [US1] Add basic styling for the `FeatureCard` component in `src/components/styles.module.css`.
- [ ] T005 [US1] Modify the homepage at `src/pages/index.tsx` to import and use the `FeatureCard` component.
- [ ] T006 [US1] In `src/pages/index.tsx`, create a list of chapter data (title, link, description) and map over it to render six `FeatureCard` components.
- [ ] T007 [US1] Update the hero section in `docusaurus.config.ts` with the correct title and tagline for the textbook.

**Checkpoint**: At this point, the homepage should be fully functional and display the six chapter cards correctly.

---

## Phase 3: User Story 2 - Navigation (Priority: P2)

**Goal**: Ensure the sidebar is automatically generated and the top navigation bar links to the textbook.

**Independent Test**: Navigate to the `/docs/intro` page and verify that the sidebar on the left correctly lists all six chapters.

### Implementation for User Story 2

- [ ] T008 [US2] Configure Docusaurus to automatically generate the sidebar from the `docs/` directory structure. This is typically configured in `sidebars.ts` or `docusaurus.config.ts`.
- [ ] T009 [US2] Verify that the file and directory structure in `docs/` matches the specified six-chapter layout.
- [ ] T010 [US2] Ensure the top navigation bar in `docusaurus.config.ts` includes a "Textbook" link pointing to `/docs/intro`.

**Checkpoint**: The sidebar and top navigation should now be fully functional.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [ ] T011 [P] Review and apply custom styling in `src/css/custom.css` to ensure the UI is clean and professional.
- [ ] T012 Run `npm run build` to ensure the entire site builds without errors.
- [ ] T013 Create `vercel.json` with the correct build command and output directory to ensure successful deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must be completed first.
- **User Story 1 (Phase 2)**: Depends on Setup completion.
- **User Story 2 (Phase 3)**: Depends on Setup completion.
- **Polish (Phase 4)**: Depends on all user stories being complete.

### Implementation Strategy

1.  Complete Phase 1: Setup.
2.  Complete Phase 2: User Story 1.
3.  Complete Phase 3: User Story 2.
4.  Complete Phase 4: Polish.
5.  Validate the final build and deployment.

# Phase-2
---
description: "Task list for implementing AI-Powered Interactive Features."
---

# Tasks: AI-Powered Interactive Features

**Input**: `specs/plan.md`
**Prerequisites**: `specs/plan.md` (required), `constitution.md` (required)

---

## Phase 1: Core RAG Backend

**Goal**: Create a functional backend service that can ingest the textbook content and answer questions about it.

### Sub-Phase 1.1: Environment Setup
- [x] T001: Create `requirements.txt` with `fastapi`, `qdrant-client`, `google-generativeai`, etc.
- [x] T002: Create a Python virtual environment at `.venv/`.
- [x] T003: Install all dependencies from `requirements.txt` into the virtual environment.
- [x] T004: Create the `.env` file to store API keys for Qdrant and Gemini.
- [x] T005: Add `.venv/` and `.env` to the `.gitignore` file.

### Sub-Phase 1.2: Content Ingestion
- [x] T006: Create the `ingest.py` script.
- [x] T007: **[P1]** Populate the `.env` file with valid `QDRANT_URL`, `QDRANT_API_KEY`, and `GEMINI_API_KEY`.
- [x] T008: **[P1]** In `ingest.py`, finalize the logic to read all markdown files, chunk them, and generate embeddings.
- [x] T009: **[P1]** Execute the `ingest.py` script and verify that the `humanoid_robotics_textbook` collection is created and populated in your Qdrant Cloud dashboard.

### Sub-Phase 1.3: FastAPI Backend
- [x] T010: **[P1]** Create the directory `api/` and the file `api/index.py`.
- [x] T011: **[P1]** In `api/index.py`, set up a basic FastAPI application.
- [x] T012: **[P1]** Implement the `/api/chat` streaming endpoint. This includes:
    - Receiving the user's query.
    - Generating an embedding for the query.
    - Searching Qdrant for relevant context.
    - Constructing a prompt for the Gemini model.
    - Calling the Gemini API and streaming the response.
- [ ] T013: **[P2]** Test the `/api/chat` endpoint locally to ensure it returns a valid, streamed response.

---

## Phase 2: Frontend Integration

**Goal**: Connect the Docusaurus frontend to the RAG backend to create a seamless chat experience.

- [ ] T014: **[P1]** Create a new React component at `src/components/Chatbot/index.tsx`.
- [ ] T015: **[P1]** Build the UI for the chatbot, including the message display area, user input field, and send button.
- [ ] T016: **[P2]** Implement state management in the component for the conversation history and loading status.
- [ ] T017: **[P1]** Write the client-side `fetch` request to call the `/api/chat` endpoint.
- [ ] T018: **[P1]** Implement logic to handle the streamed response from the backend and display it in the UI.
- [ ] T019: **[P2]** "Swizzle" the Docusaurus layout to add a floating button that toggles the visibility of the chatbot component.

---

## Phase 3: Advanced Features & Deployment

**Goal**: Add the translation and personalization features, and deploy the entire application.

- [ ] T020: **[P2]** Implement a `/api/translate` endpoint in the FastAPI application.
- [ ] T021: **[P3]** Add a "Translate" button to the UI that calls the new endpoint.
- [ ] T022: **[P3]** Create a `Quiz` component to ask users about their interests.
- [ ] T023: **[P3]** Implement logic to highlight text in `DocItem` based on interests stored in `localStorage`.
- [ ] T024: **[P3]** Configure and enable Algolia DocSearch in `docusaurus.config.ts`.
- [ ] T025: **[P1]** Configure `vercel.json` to correctly build both the Docusaurus frontend and the Python serverless functions.
- [ ] T026: **[P1]** Deploy the project to Vercel and perform end-to-end testing.

---

## Dependencies & Execution Order

- **Phase 1 (Backend)** must be completed before **Phase 2 (Frontend)**.
- **Phase 3 (Advanced Features)** can be worked on in parallel after Phase 2 begins, but deployment is the final step.
- The `[Px]` tags indicate priority (P1 = High, P2 = Medium, P3 = Low).