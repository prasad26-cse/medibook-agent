#!/usr/bin/env python3
"""
FastAPI Backend Server for MedSchedule Admin Dashboard
Run this file to start the backend server
"""

import uvicorn
from main import app

if __name__ == "__main__":
    print("🚀 Starting MedSchedule Admin API Server...")
    print("📊 Admin Dashboard API will be available at: http://localhost:8000")
    print("📖 API Documentation will be available at: http://localhost:8000/docs")
    print("🔐 Admin Credentials: admin@clinic.com / Admin@1234")
    print("=" * 60)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )