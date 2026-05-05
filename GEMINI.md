# TaskBoard Project (DevFlow Ops)

## Overview
A high-performance MERN stack task management application featuring AI-powered task assistance and interactive drag-and-drop task boards. Designed for modern project management, it provides a seamless and visually rich experience for individuals and teams to organize their work.

## Core Features
- **AI Task Breakdown:** Integrated with Google Gemini AI (`gemini-1.5-flash`) to automatically break down high-level task titles into 3-5 professional, actionable technical sub-tasks or steps. Optimized for free-tier stability.
- **Interactive Kanban Boards:** Fully functional drag-and-drop task management using `@dnd-kit`, allowing users to move tasks between columns like Backlog, In Progress, In Review, and Done.
- **Project Boards:** Ability to create and manage multiple boards to separate different projects or workstreams.
- **Task Management:** Create, edit, and delete tasks with attributes such as priority levels (Critical, High, Medium, Low), descriptions, and due dates.
- **Secure Authentication:** Robust user authentication system using JWT (JSON Web Tokens) and bcrypt for password hashing, supporting user registration and persistent login sessions.
- **Responsive & Modern UI:** A polished interface built with React 19 and Tailwind CSS, following modern design principles with interactive feedback and smooth transitions.

## Tech Stack
- **Frontend:** React 19 (Vite), Tailwind CSS, React Router, `@dnd-kit` (Drag & Drop), Axios.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **AI Integration:** Google Generative AI (`@google/generative-ai` using `gemini-1.5-flash`).
- **Security:** JWT (jsonwebtoken) and `bcryptjs`.

## Codebase Detailed Breakdown

### Backend (`/backend`)
- **`server.js`**: The main entry point, configuring Express, middleware (CORS, JSON), and connecting to MongoDB.
- **`controllers/`**:
  - `aiController.js`: Handles communication with the Google Gemini API to generate task breakdowns.
  - `authController.js`: Manages user registration, login, and token generation.
  - `taskController.js`: CRUD operations for tasks, including filtering by board and column updates.
  - `boardController.js`: Management of project boards.
- **`models/`**: Defines the data structure for `User`, `Board`, and `Task` using Mongoose schemas.
- **`middleware/authMiddleware.js`**: Protects routes by verifying the JWT in the request headers.

### Frontend (`/react-app`)
- **`src/components/`**:
  - `TaskBoard.jsx`: The core interactive Kanban component, handling drag-and-drop logic, task fetching, and AI integration for new tasks.
  - `Auth.jsx`: Comprehensive login and registration interface.
  - `Dashboard.jsx`: Main user landing page showing an overview of boards and tasks.
  - `Sidebar.jsx` & `Layout.jsx`: Structural components for app navigation and consistent UI.
- **`src/context/AppContext.jsx`**: Manages global application state, primarily user authentication and board data.
- **`src/api.js`**: A centralized Axios instance configured with base URLs and interceptors for handling authentication tokens.

## Key Conventions & Workflows
- **State Management:** Global state (Auth, User) is handled via React Context. Component-level state is used for UI transitions and local data.
- **Optimistic Updates:** The TaskBoard uses optimistic UI updates for drag-and-drop actions to ensure a snappy user experience, reverting if the backend sync fails.
- **Styling:** Adheres to a custom Material-like design system using Tailwind CSS utility classes and Google Material Symbols for iconography.
- **API Security:** All protected frontend routes and API calls require a valid JWT, which is stored in `localStorage` and managed by the `AppContext`.

## Setup & Development
1. **Environment Variables:**
   - Create a `.env` in `backend/` with: `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.
2. **Installation:**
   - Run `npm install` in both `backend/` and `react-app/` directories.
3. **Execution:**
   - Backend: `npm run dev` (uses nodemon).
   - Frontend: `npm run dev` (uses vite).
