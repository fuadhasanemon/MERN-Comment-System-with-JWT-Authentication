# 🗨️ MERN Comment System with JWT Authentication

A production-ready **comment system** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
It supports authentication, authorization, likes/dislikes, pagination, sorting, and secure API access.

This project is designed following **real-world backend architecture** and **scalable frontend state management**.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration & login
- JWT-based authentication
- Protected routes
- Only authenticated users can comment
- Only comment owners can delete their comments

### 💬 Comment System
- Add comments
- Like / Dislike (one per user)
- Toggle reactions
- Pagination
- Sorting:
  - Newest
  - Most liked
  - Most disliked

### 🧠 Frontend
- React + Redux Toolkit
- React Router
- Axios with auth interceptor
- Auth-aware UI (login required to comment)

### 🗄️ Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Clean layered architecture:
  - Routes
  - Controllers
  - Services
  - Middleware

---

## 🏗️ Tech Stack

### Frontend
- React
- Redux Toolkit
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt


## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone [https://github.com/your-username/mern-comment-system.git](https://github.com/fuadhasanemon/MERN-Comment-System-with-JWT-Authentication.git)
cd MERN-Comment-System-with-JWT-Authentication

## 🔧 Backend Setup

### 2️⃣ Install Backend Dependencies
cd server
npm install

### 4️⃣ Start Backend Server
npm run dev

### Backend runs on:

http://localhost:5000

## 🎨 Frontend Setup

### 5️⃣ Install Frontend Dependencies
cd ../client
npm install

6️⃣ Start Frontend
npm run dev


Frontend runs on:

http://localhost:5173

## 🔐 API Endpoints

### Authentication

Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user

### Comments

Method	Endpoint	Description
GET	/api/comments	Fetch comments
POST	/api/comments	Create comment
POST	/api/comments/:id/like	Like comment
POST	/api/comments/:id/dislike	Dislike comment
DELETE	/api/comments/:id	Delete own comment

## 🧪 Testing with Postman

### Register a user

### Login to get JWT token

### Add header:

Authorization: Bearer YOUR_JWT_TOKEN

### Test protected endpoints
