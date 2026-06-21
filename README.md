# Task Management

TaskFlow is a professional, secure, full-stack task management application. It features a Node.js/Express REST API backend with secure JWT authentication and MongoDB storage, coupled with a responsive, glassmorphic React dashboard styled with Tailwind CSS.

---

## Key Features

- **User Authentication**: Secure Sign-Up and Sign-In using JWT (JSON Web Tokens) and password hashing with `bcryptjs`.
- **Task Isolation**: Multi-tenant architecture where users can only view, create, update, or delete their own tasks.
- **Enhanced Task Metadata**: Keep track of details with optional descriptions, priorities (low, medium, high), due dates, and categories.
- **Productivity Dashboard**: Real-time stats widgets computing total tasks, pending tasks, high-priority tasks, and overdue tasks.
- **Visual Progress Tracker**: A dynamic progress bar indicating overall completion rates.
- **Search, Filter & Sort**:
  - Full-text search across titles and descriptions.
  - Filter tasks by status, priority level, or dynamically detected categories.
  - Sort tasks by creation date, due date, or priority importance.
- **True In-Place Editing**: Smooth inline task updates without losing task IDs or creation history.

---

## Tech Stack

### Backend
- **Node.js** & **Express** (API framework)
- **MongoDB** & **Mongoose** (Database & ODM)
- **jsonwebtoken** (Token authentication)
- **bcryptjs** (Password security)
- **validator** (Input validation)

### Frontend
- **React 19** & **Vite** (Build tool)
- **Tailwind CSS v4** (Styling)
- **React Icons** (UI icons)
- **React Hot Toast** (Toast notifications)
- **Axios** (API requests)

---

## Project Structure

```text
Task Manager/
├── Backend/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Controllers for users and tasks
│   ├── middleware/         # JWT authorization middleware
│   ├── models/             # Mongoose schemas (User & Task)
│   ├── routers/            # Express routers
│   ├── .env                # Port, Database URI, and JWT Secret
│   ├── server.js           # Server entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── assets/         # Images and SVGs
│   │   ├── App.jsx         # Main application component (Auth/Dashboard)
│   │   ├── index.css       # Tailwind entry point
│   │   └── main.jsx        # React root registration
│   ├── index.html          # HTML entry point
│   ├── vite.config.js      # Vite build configuration
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or an Atlas connection string

---

### Step 1: Set Up Backend

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create or configure your `.env` file inside the `Backend` directory:
   ```env
   PORT=5000
   DB_URL=mongodb://localhost:27017/
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will start on `http://localhost:5000`.

---

### Step 2: Set Up Frontend

1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

## API Endpoints

### Authentication Routes
- `POST /api/users/register` - Create a new account
- `POST /api/users/login` - Login to an account
- `GET /api/users/profile` - Get logged-in user profile (Protected)

### Task Routes (Protected)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Fetch all tasks for the logged-in user
- `PATCH /api/tasks/:id` - Update details of a task
- `PATCH /api/tasks/:id/toggle` - Toggle completion status of a task
- `DELETE /api/tasks/:id` - Delete a task

---
=======
# Task Manager

Task Manager is a full-stack web application that allows users to efficiently manage their daily tasks. The project is divided into two main parts: a React-based frontend for a responsive user interface, and a Node.js/Express backend that provides a RESTful API for task management. The backend uses a modular structure for scalability and maintainability.

## Features

- Add, edit, and delete tasks
- View a list of all tasks
- RESTful API for task operations
- Modern, responsive frontend built with React and Vite
- Organized backend with MVC architecture


## Getting Started

### Frontend

1. Navigate to the `Frontend` directory:
    ```
    cd Frontend
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Start the development server:
    ```
    npm run dev
    ```

### Backend

1. Navigate to the `Backend` directory:
    ```
    cd Backend
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Configure your `.env` file for database and environment variables.

4. Start the backend server:
    ```
    npm start
    ```
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3
