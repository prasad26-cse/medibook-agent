from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import jwt
import datetime
from passlib.context import CryptContext
import uvicorn

app = FastAPI(title="MedSchedule Admin API", version="1.0.0")

# CORS middleware for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "medschedule_secret_key_2024"
ALGORITHM = "HS256"

# Predefined admin credentials
ADMIN_CREDENTIALS = {
    "email": "admin@clinic.com",
    "password": "Admin@1234"
}

# Models
class AdminLogin(BaseModel):
    email: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str

class Appointment(BaseModel):
    id: Optional[str] = None
    patient_name: str
    doctor: str
    date: str
    time: str
    status: str = "Confirmed"
    patient_type: str = "New"
    phone: Optional[str] = None
    insurance: Optional[str] = None

class Patient(BaseModel):
    id: Optional[str] = None
    name: str
    dob: str
    phone: str
    email: str
    patient_type: str
    insurance_carrier: Optional[str] = None
    member_id: Optional[str] = None

class Doctor(BaseModel):
    id: Optional[str] = None
    name: str
    specialty: str
    availability: List[str] = []

# Mock data
appointments_db = [
    {
        "id": "1",
        "patient_name": "John Smith",
        "doctor": "Dr. Johnson",
        "date": "2024-01-15",
        "time": "09:00",
        "status": "Confirmed",
        "patient_type": "New",
        "phone": "(555) 123-4567",
        "insurance": "BlueCross"
    },
    {
        "id": "2",
        "patient_name": "Sarah Wilson",
        "doctor": "Dr. Brown",
        "date": "2024-01-16",
        "time": "14:30",
        "status": "Pending",
        "patient_type": "Returning",
        "phone": "(555) 987-6543",
        "insurance": "Aetna"
    }
]

patients_db = [
    {
        "id": "1",
        "name": "John Smith",
        "dob": "1985-03-15",
        "phone": "(555) 123-4567",
        "email": "john.smith@email.com",
        "patient_type": "New",
        "insurance_carrier": "BlueCross",
        "member_id": "BC123456"
    },
    {
        "id": "2",
        "name": "Sarah Wilson",
        "dob": "1990-07-22",
        "phone": "(555) 987-6543",
        "email": "sarah.wilson@email.com",
        "patient_type": "Returning",
        "insurance_carrier": "Aetna",
        "member_id": "AET789012"
    }
]

doctors_db = [
    {
        "id": "1",
        "name": "Dr. Johnson",
        "specialty": "Family Medicine",
        "availability": ["09:00", "10:00", "11:00", "14:00", "15:00"]
    },
    {
        "id": "2",
        "name": "Dr. Brown",
        "specialty": "Internal Medicine", 
        "availability": ["08:00", "09:30", "11:00", "13:30", "15:00"]
    }
]

# Auth functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None or email != ADMIN_CREDENTIALS["email"]:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# Auth endpoints
@app.post("/api/admin/login", response_model=AdminToken)
async def admin_login(credentials: AdminLogin):
    if (credentials.email == ADMIN_CREDENTIALS["email"] and 
        credentials.password == ADMIN_CREDENTIALS["password"]):
        access_token = create_access_token(data={"sub": credentials.email})
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/admin/verify")
async def verify_admin(current_user: str = Depends(verify_token)):
    return {"valid": True, "user": current_user}

# Admin dashboard endpoints
@app.get("/api/admin/appointments", response_model=List[Appointment])
async def get_appointments(current_user: str = Depends(verify_token)):
    return appointments_db

@app.post("/api/admin/appointments", response_model=Appointment)
async def create_appointment(appointment: Appointment, current_user: str = Depends(verify_token)):
    appointment.id = str(len(appointments_db) + 1)
    appointments_db.append(appointment.dict())
    return appointment

@app.put("/api/admin/appointments/{appointment_id}")
async def update_appointment(appointment_id: str, appointment: Appointment, current_user: str = Depends(verify_token)):
    for i, apt in enumerate(appointments_db):
        if apt["id"] == appointment_id:
            appointment.id = appointment_id
            appointments_db[i] = appointment.dict()
            return {"message": "Appointment updated"}
    raise HTTPException(status_code=404, detail="Appointment not found")

@app.get("/api/admin/patients", response_model=List[Patient])
async def get_patients(current_user: str = Depends(verify_token)):
    return patients_db

@app.get("/api/admin/doctors", response_model=List[Doctor])
async def get_doctors(current_user: str = Depends(verify_token)):
    return doctors_db

@app.get("/api/admin/dashboard/stats")
async def get_dashboard_stats(current_user: str = Depends(verify_token)):
    total_appointments = len(appointments_db)
    confirmed_appointments = len([apt for apt in appointments_db if apt["status"] == "Confirmed"])
    total_patients = len(patients_db)
    new_patients = len([pt for pt in patients_db if pt["patient_type"] == "New"])
    
    return {
        "total_appointments": total_appointments,
        "confirmed_appointments": confirmed_appointments,
        "pending_appointments": total_appointments - confirmed_appointments,
        "total_patients": total_patients,
        "new_patients": new_patients,
        "returning_patients": total_patients - new_patients
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)