# MediCare Allergy & Wellness Center - Patient Portal

A modern, comprehensive healthcare management system built with React, TypeScript, and Supabase for MediCare Allergy & Wellness Center.

## 🏥 About

MediCare Allergy & Wellness Center Patient Portal is a full-featured healthcare management application that provides patients with easy access to appointment booking, medical forms, health assistance, and profile management. The system also includes administrative capabilities for healthcare providers.

## ✨ Features

### Patient Features
- **🔐 Secure Authentication**: User registration and login with email verification
- **📅 Appointment Booking**: Schedule appointments with available doctors
- **📋 Medical Forms**: Complete and view New Patient Intake Forms
- **🤖 AI Health Assistant**: Interactive chatbot for health-related questions
- **👤 Profile Management**: Update personal and insurance information
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

### Administrative Features
- **👨‍⚕️ Admin Dashboard**: Comprehensive overview of clinic operations
- **📊 Patient Management**: View and manage patient records
- **🗓️ Appointment Management**: Monitor and manage appointments
- **👩‍⚕️ Doctor Schedules**: Manage healthcare provider schedules

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** for beautiful, accessible components
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **React Hook Form** with Zod validation

### Backend & Database
- **Supabase** for backend services
- **PostgreSQL** database with Row Level Security (RLS)
- **Real-time subscriptions** for live updates
- **Edge Functions** for serverless operations

### UI/UX
- **Responsive Design** with mobile-first approach
- **Dark/Light Mode** support
- **Accessibility** compliant components
- **Toast Notifications** for user feedback
- **Loading States** and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medicare-patient-portal.git
   cd medicare-patient-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_PROJECT_ID="your-project-id"
   VITE_SUPABASE_URL="your-supabase-url"
   VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗃️ Database Schema

The application uses the following main tables:

### Patients
- Patient information and insurance details
- Linked to user authentication

### Doctors
- Healthcare provider information
- Specialties and locations

### Appointments
- Appointment scheduling and management
- Links patients and doctors

### Forms
- Medical forms and responses
- Patient intake information

### Reminders
- Appointment reminders and notifications

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **User authentication** with Supabase Auth
- **Data encryption** at rest and in transit
- **Input validation** with Zod schemas
- **CSRF protection** and secure headers

## 📱 Key Components

### Patient Portal
- **Dashboard**: Overview of appointments, forms, and health metrics
- **Booking System**: Interactive appointment scheduling
- **Health Chat**: AI-powered health assistant
- **Form Viewer**: Digital intake forms with download capability
- **Profile Management**: Personal and insurance information

### Admin Portal
- **Admin Dashboard**: Clinic overview and statistics
- **Patient Management**: View and manage patient records
- **Appointment Management**: Monitor appointments and schedules
- **Doctor Management**: Manage healthcare provider schedules

## 🔐 Admin Access

**Admin Credentials:**
- Email: `admin@clinic.com`
- Password: `Admin@1234`

Access admin dashboard at: `/admin-dashboard`

## 🎨 Design System

The application uses a comprehensive design system with:
- **Semantic color tokens** for consistent theming
- **Responsive breakpoints** for all screen sizes
- **Custom gradients** and animations
- **Accessible color contrasts** meeting WCAG guidelines
- **Component variants** for different use cases

## 🧪 Testing

The application includes comprehensive testing setup:

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📦 Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy to your preferred platform**
   - The build output will be in the `dist` folder
   - Can be deployed to Vercel, Netlify, or any static hosting service

## 🚀 Deployment

### Supabase Setup
1. Create a new Supabase project
2. Run the database migrations from the `supabase/migrations` folder
3. Configure Row Level Security policies
4. Set up authentication providers as needed

### Environment Configuration
- Update environment variables for production
- Configure custom domain if needed
- Set up error monitoring and analytics

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