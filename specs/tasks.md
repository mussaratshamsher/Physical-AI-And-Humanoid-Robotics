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