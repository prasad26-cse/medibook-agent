# MedSchedule - Medical Appointment Management System

A comprehensive medical appointment management system with patient portal and admin dashboard.

## 🚀 Features

### Patient Portal (Frontend)
- **Authentication**: User sign up/sign in with Supabase
- **Appointment Booking**: Schedule appointments with available doctors
- **Health Chatbot**: Rule-based AI assistant for health queries
- **Dashboard**: Personal appointment management
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Admin Dashboard (Backend + Frontend)
- **Secure Admin Login**: Predefined admin credentials
- **Appointments Management**: View, confirm, and cancel appointments
- **Patient Records**: Search and view patient information
- **Doctor Schedules**: Manage doctor availability
- **Dashboard Analytics**: Real-time statistics and insights
- **FastAPI Backend**: RESTful API with JWT authentication

## 🏗️ Architecture

```
├── frontend/               # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom React hooks
│   └── package.json
├── backend/                # FastAPI + Python
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── run.py             # Server launcher
└── supabase/              # Database & Auth
    ├── functions/         # Edge functions
    └── migrations/        # Database migrations
```

## 🚀 Quick Start

### Frontend (React)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on `http://localhost:5173`

### Backend (FastAPI)
```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
python run.py
```
Backend API runs on `http://localhost:8000`

### Database (Supabase)
- Supabase handles user authentication and data storage
- Edge functions for email confirmations
- Row Level Security (RLS) policies implemented

## 🔐 Admin Access

**Admin Credentials:**
- Email: `admin@clinic.com`
- Password: `Admin@1234`

Access admin dashboard at: `http://localhost:5173/admin-dashboard`

## 📊 API Documentation

FastAPI provides interactive API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key API Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/doctors` - Get doctor schedules
- `GET /api/admin/dashboard/stats` - Dashboard statistics

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **React Router** - Navigation
- **Supabase** - Backend as a Service

### Backend
- **FastAPI** - Python web framework
- **JWT** - Authentication tokens
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **CORS** - Cross-origin requests

### Database & Services
- **Supabase** - PostgreSQL database with real-time features
- **Resend** - Email service (free tier)
- **Edge Functions** - Serverless functions

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup
1. Create a Supabase project
2. Run database migrations
3. Configure authentication providers
4. Set up RLS policies

## 📱 Features Overview

### Patient Features
- ✅ User registration and authentication
- ✅ Appointment booking with doctor selection
- ✅ Personal dashboard with appointment history
- ✅ Health chatbot for basic queries
- ✅ Email confirmations for appointments

### Admin Features  
- ✅ Secure admin authentication
- ✅ Comprehensive appointments management
- ✅ Patient records with search functionality
- ✅ Doctor schedule management
- ✅ Real-time dashboard statistics
- ✅ Appointment status updates

### Technical Features
- ✅ Responsive design for all devices
- ✅ Real-time data updates
- ✅ Secure API with JWT authentication
- ✅ Row-level security in database
- ✅ CORS-enabled backend
- ✅ Free tier services integration

## 🚀 Deployment

### Frontend Deployment
- Can be deployed to Vercel, Netlify, or any static hosting
- Build command: `npm run build`
- Output directory: `dist/`

### Backend Deployment
- Can be deployed to Railway, Render, or any Python hosting
- Dockerfile ready for containerization
- Environment variables configuration required

---

## 🏥 Original Project Info

**Lovable Project URL**: https://lovable.dev/projects/08515570-3bea-4d80-a480-27b3c6f3c0bc

### How to edit this code?

**Use Lovable**: Visit the [Lovable Project](https://lovable.dev/projects/08515570-3bea-4d80-a480-27b3c6f3c0bc) and start prompting.

**Use your preferred IDE**: Clone this repo and push changes.

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

### Lovable Technologies Used
- Vite
- TypeScript  
- React
- shadcn-ui
- Tailwind CSS

Built with ❤️ using React, FastAPI, and Supabase