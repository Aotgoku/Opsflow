# DevFlow Ops

A full-stack Kanban project management platform built with the MERN stack. It supports drag-and-drop task management across multiple boards, AI-powered task breakdown using the Google Gemini API, and JWT-based authentication.

---

## Live Demo

> Run locally — see setup instructions below.

---

## Features

- **Multi-board Kanban** — Create and manage multiple project boards
- **Drag & Drop** — Move tasks between columns using `@dnd-kit`
- **AI Task Breakdown** — Auto-generate implementation steps for any task using Gemini 2.0 Flash
- **JWT Authentication** — Secure login/signup with token-based auth
- **Task Priority Levels** — Low, Medium, High, Critical
- **Column Management** — Clear all tasks in a column with one click
- **Persistent Storage** — All tasks and boards saved to MongoDB

---

## Tech Stack

| Layer     | Technology                            |
|-----------|---------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, dnd-kit |
| Backend   | Node.js, Express.js                   |
| Database  | MongoDB, Mongoose                     |
| AI        | Google Gemini 2.0 Flash               |
| Auth      | JWT, bcryptjs                         |

---

## Project Structure

```
dev/
├── backend/                    # Express REST API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js     # Gemini AI integration
│   │   ├── authController.js   # Login / signup logic
│   │   ├── boardController.js  # Board CRUD
│   │   ├── taskController.js   # Task CRUD
│   │   └── userController.js   # User profile
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT protect middleware
│   ├── models/
│   │   ├── Board.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── boardRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── .env                    # Environment variables (not committed)
│   ├── .gitignore
│   ├── package.json
│   └── server.js               # Entry point
│
└── react-app/                  # React frontend
    ├── public/
    └── src/
        ├── components/
        │   ├── Auth.jsx            # Login / Signup page
        │   ├── CreateBoardModal.jsx
        │   ├── Dashboard.jsx       # Board overview
        │   ├── Docs.jsx
        │   ├── Layout.jsx          # App shell with sidebar
        │   ├── MyTasks.jsx
        │   ├── Settings.jsx
        │   ├── Sidebar.jsx
        │   ├── Support.jsx
        │   ├── TaskBoard.jsx       # Kanban board with AI feature
        │   └── Team.jsx
        ├── context/
        ├── api.js                  # Axios instance
        ├── App.jsx                 # Routes
        ├── index.css
        └── main.jsx
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key — [Get one here](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/devflow-ops.git
cd devflow-ops
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd react-app
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

---

## API Endpoints

### Auth
| Method | Endpoint            | Description     |
|--------|---------------------|-----------------|
| POST   | `/api/auth/register`| Register user   |
| POST   | `/api/auth/login`   | Login user      |

### Boards
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| GET    | `/api/boards`      | Get all boards    |
| POST   | `/api/boards`      | Create a board    |
| DELETE | `/api/boards/:id`  | Delete a board    |

### Tasks
| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| GET    | `/api/tasks`      | Get all tasks       |
| POST   | `/api/tasks`      | Create a task       |
| PATCH  | `/api/tasks/:id`  | Update a task       |
| DELETE | `/api/tasks/:id`  | Delete a task       |

### AI
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/ai/breakdown` | Generate task steps (JWT protected) |

---

## Common Gemini API Errors

| Error | What it means | Fix |
|-------|--------------|-----|
| `404 Not Found — model not found` | The model name is wrong or deprecated | Use `gemini-2.0-flash` |
| `400 Bad Request` | Prompt is empty or malformed | Check that title is sent in the request body |
| `401 Unauthorized` | API key is missing or invalid | Verify `GEMINI_API_KEY` in `.env` |
| `429 Too Many Requests` | Rate limit exceeded on free tier | Wait and retry, or upgrade your plan |
| `500 Internal Server Error` | Backend crash, usually a code bug | Check terminal logs for the real error |
| `ENOTFOUND` / Network Error | No internet connection | Check your network |

> **Most common cause of all errors:** The `.env` file is either empty, unsaved, or the key has expired. Always verify your `.env` is saved with a valid key before debugging further.

---

## Environment Variables

| Variable        | Required | Description                        |
|-----------------|----------|------------------------------------|
| `MONGO_URI`     | Yes      | MongoDB connection string          |
| `JWT_SECRET`    | Yes      | Secret key for signing JWT tokens  |
| `GEMINI_API_KEY`| Yes      | Google Gemini API key              |
| `PORT`          | No       | Server port (defaults to `5000`)   |

---

## Security

- All sensitive credentials are stored in `.env` and excluded from version control via `.gitignore`
- All AI and task routes are protected with JWT middleware
- Passwords are hashed using `bcryptjs` before storage

---

## License

MIT
