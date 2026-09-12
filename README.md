# EduPredict Pro: Intelligent Student Performance Prediction & Management System

EduPredict Pro is a state-of-the-art, full-stack, secure academic analytics and student management platform. Designed for modern educational institutions, it combines Machine Learning (ML) techniques with robust database management to predict student outcomes, manage student profiles, and offer data-driven academic support.

---

## 🚀 Key Features

### 1. Multi-Role Secure Authentication
- **Student Access**: Personal dashboard authenticated using unique Student Register Numbers (e.g., `STU001`, `STU002`, `STU003`).
- **Faculty/Admin Access**: High-level system dashboard authenticated via `ADMIN123` register number.

### 2. Machine Learning Prediction Models
- **Decision Tree Classifier**: Identifies critical risk thresholds (e.g., Attendance < 60%, Internals < 35%) to predict Pass/Fail status.
- **Regression Analysis Model**: Estimates expected final scores and calculates overall percentages using weighted parameters:
  - Attendance (25% Weight)
  - Internal examination marks (40% Weight)
  - Assignment scores (25% Weight)
  - Normalized study hours (10% Weight)

### 3. Early Warning & Risk Alert System
- Detects students at academic risk in real-time.
- Classifies risk levels dynamically: **Low Risk**, **Medium Risk**, and **High Risk**.
- Provides explicit reasons for risk (such as severe attendance shortage or weak internal assessment performance).

### 4. Personalized Support & Study recommendations
- Automatically generates improvement pathways.
- Recommends tailored targets for attendance improvement, self-study routines, and assignment completion strategies.

### 5. Academic Timeline & Progress Tracking
- Tracks academic performance across assessments and semesters.
- Renders an interactive line chart visualizing performance trajectories.

### 6. Peer & Class Analytics (Faculty View)
- Displays all student details in a highly readable, interactive tabular format.
- Interactive distribution graphs for student scores and risk levels.
- Direct tools to identify at-risk students for counseling.

### 7. Motivation Score Generator
- Dynamically computes a student motivation score (0–100) based on active variables.
- Groups motivation into **Highly Motivated**, **Moderately Motivated**, and **Low Motivation**.

### 8. Explainable AI (XAI) Feature
- Visualizes feature importances so students and educators understand the key drivers behind every prediction.

### 9. Interactive What-If Self-Assessment
- Enables students to simulate effort changes (e.g., increasing study hours or attending more lectures) to see their overall prediction update in real-time.

---

## 🔮 Future Enhancements

### 1. AI Chatbot for Student Assistance
Integrate an AI-powered chatbot to answer student queries related to attendance, marks, performance predictions, study materials, examination schedules, and academic guidance. The chatbot can provide instant support 24/7 and improve user engagement.

### 2. AI-Based Personalized Learning Recommendations
Implement advanced AI algorithms to provide personalized study plans, learning resources, and improvement strategies based on each student's academic performance, strengths, and weaknesses.

### 3. Mobile Application with Real-Time Notifications
Develop an Android/iOS application that enables students and faculty to access the system from anywhere. Real-time notifications can be sent for attendance shortages, assignment deadlines, examination schedules, and performance alerts.

### 4. Cloud-Based Deployment and Advanced Analytics
Deploy the system on a secure cloud platform to enable remote access and centralized data management. Add an advanced analytics dashboard for administrators to monitor institutional performance, generate reports, and analyze academic trends efficiently.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, Tailwind CSS 4, Framer Motion, Recharts
- **Backend**: Node.js, Express
- **Database**: SQLite (via `better-sqlite3`)
- **System Language**: TypeScript

---

## 💻 Running the Application Locally

1. **Clone the Repository**
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file based on `.env.example`.
4. **Run in Development Mode**
   ```bash
   npm run dev
   ```
   The dev server will boot up and serve the application on port `3000`.
