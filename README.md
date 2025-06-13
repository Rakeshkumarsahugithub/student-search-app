# 🎓 Student Search Application

![React](https://img.shields.io/badge/React-18.3.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20.17-green.svg)
![MaterialUI](https://img.shields.io/badge/MaterialUI-5.0-purple.svg)
![Express](https://img.shields.io/badge/Express-5.1-black.svg)

A modern student search application with lazy loading functionality, featuring:

- 🔍 Smart search with 3-character minimum
- ⚡ Instant results with debouncing
- 🎨 Beautiful Material UI interface
- 📱 Fully responsive design
- 📊 Student details display
- ❌ "Not found" popup with 1.2s delay



---

## 🌐 API Endpoints

| Endpoint                | Method | Description                                      |
|------------------------|--------|--------------------------------------------------|
| `/api/students/search` | GET    | Search students by name (query parameter: `query`) |
| `/api/students`        | GET    | Get all students (for testing/demo purposes)     |


## 🚀 Features
### 🔍 Search Functionality
Lazy loading after 3 characters

Case-insensitive search

Debounced requests (300ms)

Max 5 results displayed

### 🎨 UI Highlights
Material UI design system

Student avatars with generated colors

Clean, responsive layout

"Not found" popup dialog

Loading indicators

### ⚙️ Technical Implementation
React.js frontend

Express.js backend

RESTful API

JSON file as mock database

Proper error handling & clean UX

---
### 📂 Project Structure

```bash
student-search-app/
├── backend/
│ ├── server.js # Backend server
│ ├── student_data.json # Student database (mock)
│ └── package.json # Backend dependencies
└── frontend/
├── src/
│ ├── App.js # Main application component
│ └── Main.js # React entry point
└── package.json # Frontend dependencies
```
## 🛠️ Installation & Setup

### 📋 Prerequisites

- **Node.js** (v20.17.0)
- **React** (v18.3)

---

### 🖥️ Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```
  
2. Install dependencies:

   ```bash
   npm install
   ```


3. Start the server:

  ```bash
  node server.js
```


---

### 💻 Frontend Setup
1. Navigate to the frontend directory:
 ```bash
cd frontend
```

2. Install dependencies:
 ```bash
npm install
```
3. Start the development server:
 ```bash
 npm run dev
```



