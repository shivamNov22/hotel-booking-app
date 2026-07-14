Deployment Documentation

1. Hosting Platform Used
   Component Platform
   Frontend Vercel
   Backend Render
   Database MongoDB Atlas
   Source Code GitHub
   Live URLs

Frontend

https://hotel-booking-app-one-cyan.vercel.app/

Backend API

https://hotel-booking-app-backend-q0qj.onrender.com

GitHub Repository

https://github.com/shivamNov22/hotel-booking-app

2. Database Deployment Details

The application uses MongoDB Atlas, a fully managed cloud database service.

Database Features
MongoDB Atlas Cloud Database
Mongoose ODM
Collections
Users
Hotels
Rooms
Bookings
Payments
Connection

Backend connects using the following environment variable:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hotel-booking 3. Steps to Run the Application Locally
Clone Repository
git clone https://github.com/shivamNov22/hotel-booking-app.git

cd hotel-booking-app
Backend Setup
cd backend

npm install

Create

.env

Example

PORT=5000

NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:3000

Run backend

npm start

Server will start at

http://localhost:5000
Frontend Setup

Open another terminal

cd frontend

npm install

Create

.env.local

Example

NEXT_PUBLIC_API_URL=http://localhost:5000/api

Run frontend

npm run dev

Application will be available at

http://localhost:3000 4. Environment / Configuration Details
Backend (.env)
PORT=5000

NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:3000
Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Production Environment
Backend
PORT=10000

NODE_ENV=production

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=https://your-frontend.vercel.app
Frontend
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
Build Commands
Frontend
npm run build

Run production

npm start
Backend
npm install
npm start
Deployment Workflow
Developer
│
▼
GitHub Repository
│
┌───┴────────────┐
│ │
▼ ▼
Vercel Render
Frontend Backend
│ │
└─────┬─────┘
▼
MongoDB Atlas
