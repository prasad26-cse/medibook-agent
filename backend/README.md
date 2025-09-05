# MedSchedule Admin API Backend

FastAPI backend for the MedSchedule Admin Dashboard.

## Quick Start

1. **Install Dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run the Server:**
```bash
python run.py
```

The API will be available at `http://localhost:8000`

## Admin Credentials

- **Username:** admin@clinic.com
- **Password:** Admin@1234

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token

### Dashboard Data
- `GET /api/admin/appointments` - Get all appointments
- `POST /api/admin/appointments` - Create new appointment
- `PUT /api/admin/appointments/{id}` - Update appointment
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/doctors` - Get all doctors
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## Features

- ✅ Secure admin authentication with JWT tokens
- ✅ CORS enabled for frontend connectivity
- ✅ RESTful API endpoints
- ✅ Mock data for appointments, patients, and doctors
- ✅ Dashboard statistics
- ✅ Free tier implementation (no external dependencies)

## Development

The server runs with auto-reload enabled for development. Make changes to the code and the server will restart automatically.

Visit `http://localhost:8000/docs` for interactive API documentation.