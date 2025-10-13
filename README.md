# 💰 Expense Tracker Web App

A full-stack **Expense Management Web Application** built with **Node JS**, **React (Vite + TypeScript)**, and **MongoDB**.  
This project helps users track income, expenses, and budgets with a clean UI and secure backend API.

---

## 🔗 Link demo : [expense-tracker.truong-dev.site](http://expense-tracker.truong-dev.site/login)

## 🏗️ Tech Stack

| Layer        | Technology |
|---------------|-------------|
| Frontend      | React, Vite, TypeScript, MUI |
| Backend       | Node JS, Express JS, Mongoose, JWT Authentication |
| Database      | MongoDB |
| Containerization | Docker, Docker Compose |
| Others        | Axios, ESLint, Prettier, Docker, EC2 |

---

## 📂 Project Structure

```
assignment-simple
├─ client
│  ├─ .dockerignore
│  ├─ .prettierrc
│  ├─ Dockerfile
│  ├─ public
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  ├─ components
│  │  ├─ context
│  │  ├─ hook
│  │  ├─ layout
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  ├─ services
│  │  ├─ types
│  │  └─ utils
├─ docker-compose.yml
├─ README.md
└─ server
   ├─ .dockerignore
   ├─ .prettierrc
   ├─ app
   │  ├─ config
   │  ├─ controllers
   │  ├─ index.js
   │  ├─ middleware
   │  ├─ models
   │  ├─ routes
   │  └─ utils
   ├─ Dockerfile
   └─ public

```

## ✨ Features

### 👤 Authentication
- Login / Register with email & password  
- Login with **Google Account (OAuth2)**  
- Secure JWT-based authentication  

### 💼 Wallet Management
- Create multiple **bank accounts** 
- Set initial balance for each wallet   
- View total balance across all wallets  

### 💸 Transactions History
- Add **income** or **expense** transactions  
- Choose category (e.g. Food, Salary, Transport, Bills, etc.)  
- Attach note or description  

### 📅 Statements & Reports
- View **transaction history** by **date range** (`fromDate`, `toDate`)  
- Show transaction details

### ⚙️ Settings & Others
- Fully responsive modern UI  
- Auto sync with backend  
- Prettier & ESLint setup for code formatting  
- Dockerized setup (client, server, and MongoDB)

## ⚙️ Environment Variables

#### Root (.env):
> File này nằm cùng cấp với `docker-compose.yml`, giúp Docker Compose truyền biến môi trường vào client và server.

```
# === Google OAuth ===
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret

# === API URL (Frontend sẽ gọi đến URL này) ===
VITE_API_URL=http://localhost:5000/api

# === MongoDB Configuration ===
MONGO_INITDB_ROOT_USERNAME=your_username
MONGO_INITDB_ROOT_PASSWORD=your_password
MONGO_URI=mongodb://your_username:your_password@mongo:27017/expense_tracker?authSource=admin
```
#### Frontend (.env):
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=server_url
```
#### Backend (.env):
```
MONGO_INITDB_ROOT_USERNAME=your_username
MONGO_INITDB_ROOT_PASSWORD=your_password
MONGO_URI=mongodb://your_username:your_password@mongo:27017/expense_tracker?authSource=admin
PORT=PORT
JWT_SECRET=your_secret
```
## 🚀 Quick Start

### Method 1: Using Docker (Recommended)

```
# Clone the repository
git clone <your-repo-url>
cd assignment-simple

# Start all services
docker-compose up -d

# The app will be available at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```
### Method 2: Local Development

#### Backend Setup
```
cd server

# Install dependencies
npm install

# Environment setup
cp .env.example .env

# Edit .env with your MongoDB and JWT settings

# Start development server
npm start
```

#### Frontend
```
cd client

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

## 👨‍💻 Author
**Tran Quang Truong**

🔗[GitHub Profile](https://github.com/TranTruong753/expense-tracker)

