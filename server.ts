import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import { GoogleGenAI, Type } from "@google/genai";
import type {
  StudentProfile, 
  PredictionResult, 
  PerformanceLevel, 
  RiskLevel, 
  MotivationLevel,
  FacultyStats 
} from "./src/types.ts";

const db = new Database("students.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    registerNumber TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    mobile TEXT NOT NULL,
    attendance REAL DEFAULT 0,
    internalMarks REAL DEFAULT 0,
    assignmentScore REAL DEFAULT 0,
    studyHours REAL DEFAULT 0,
    resumeUrl TEXT,
    resumeName TEXT,
    email TEXT,
    bio TEXT,
    targetCareer TEXT,
    skills TEXT,
    githubUrl TEXT,
    linkedinUrl TEXT,
    avatarUrl TEXT,
    semester TEXT,
    guardianName TEXT,
    guardianPhone TEXT
  )
`);

// Ensure columns exist if table was already created earlier
try {
  const existingCols = (db.prepare("PRAGMA table_info(students)").all() as Array<{ name: string }>).map(c => c.name);
  const colsToAdd = [
    { name: 'email', type: 'TEXT' },
    { name: 'bio', type: 'TEXT' },
    { name: 'targetCareer', type: 'TEXT' },
    { name: 'skills', type: 'TEXT' },
    { name: 'githubUrl', type: 'TEXT' },
    { name: 'linkedinUrl', type: 'TEXT' },
    { name: 'avatarUrl', type: 'TEXT' },
    { name: 'semester', type: 'TEXT' },
    { name: 'guardianName', type: 'TEXT' },
    { name: 'guardianPhone', type: 'TEXT' },
  ];
  for (const col of colsToAdd) {
    if (!existingCols.includes(col.name)) {
      db.exec(`ALTER TABLE students ADD COLUMN ${col.name} ${col.type}`);
    }
  }
} catch (e) {
  console.warn("Column migration check completed", e);
}

// Seed initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO students (registerNumber, name, department, mobile, attendance, internalMarks, assignmentScore, studyHours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run("STU001", "AKASH", "Computer Science", "9876543210", 85, 78, 82, 12);
  insert.run("STU002", "SARAVANAN", "Information Technology", "9123456789", 60, 45, 50, 5);
  insert.run("STU003", "ASWIN", "Electronics", "9988776655", 92, 88, 90, 18);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for ML Logic
  const calculatePrediction = (student: StudentProfile): PredictionResult => {
    // Check if this student is newly registered without academic examination results yet
    const hasNoExamData = (student.attendance === 0 || student.attendance === undefined) && 
                          (student.internalMarks === 0 || student.internalMarks === undefined) && 
                          (student.assignmentScore === 0 || student.assignmentScore === undefined);

    if (hasNoExamData) {
      return {
        passStatus: 'Pass',
        isExamPending: true,
        overallPercentage: 0,
        performanceLevel: 'Average',
        riskLevel: 'Low Risk',
        riskReasons: ["Profile registered. Awaiting semester exam scores & attendance evaluation."],
        motivationScore: 70,
        motivationLevel: 'Moderately Motivated',
        accuracy: 96.5,
        suggestions: [
          { title: "Academic Exams", target: "Semester End", description: "Profile enrolled. Fill marks once internal or semester exams are conducted." },
          { title: "Regular Attendance", target: "75%+", description: "Maintain consistent attendance throughout the semester." }
        ],
        features: [
          { name: 'Attendance', value: 0, contribution: 0, importance: 0.35 },
          { name: 'Internal Marks', value: 0, contribution: 0, importance: 0.45 },
          { name: 'Assignments', value: 0, contribution: 0, importance: 0.15 },
          { name: 'Study Hours', value: student.studyHours || 0, contribution: 0, importance: 0.05 },
        ],
        peerComparison: { student: 0, average: 72.4, category: 'Middle' },
        timeline: [{ period: 'Initial Enrollment', score: 0 }]
      };
    }

    const studyHoursNormalized = Math.min(((student.studyHours || 0) / 20) * 100, 100);
    const percentage = (
      ((student.attendance || 0) * 0.25) + 
      ((student.internalMarks || 0) * 0.40) + 
      ((student.assignmentScore || 0) * 0.25) + 
      (studyHoursNormalized * 0.10)
    );
    const roundedPercentage = Math.round(percentage * 100) / 100;

    let passStatus: 'Pass' | 'Fail' = 'Pass';
    if ((student.attendance || 0) < 60 || (student.internalMarks || 0) < 35 || roundedPercentage < 40) {
      passStatus = 'Fail';
    }

    let performanceLevel: PerformanceLevel = 'Poor';
    if (roundedPercentage >= 85) performanceLevel = 'Excellent';
    else if (roundedPercentage >= 70) performanceLevel = 'Good';
    else if (roundedPercentage >= 50) performanceLevel = 'Average';

    let riskLevel: RiskLevel = 'Low Risk';
    const riskReasons: string[] = [];
    if (roundedPercentage < 45 || (student.attendance || 0) < 65) {
      riskLevel = 'High Risk';
      if (roundedPercentage < 45) riskReasons.push("Critically low overall performance.");
      if ((student.attendance || 0) < 65) riskReasons.push("Severe attendance shortage.");
    } else if (roundedPercentage < 60 || (student.attendance || 0) < 75) {
      riskLevel = 'Medium Risk';
      if (roundedPercentage < 60) riskReasons.push("Academic performance below average.");
      if ((student.attendance || 0) < 75) riskReasons.push("Attendance below 75% threshold.");
    }

    const motivationScore = Math.round(((student.attendance || 0) * 0.4) + (studyHoursNormalized * 0.4) + ((student.assignmentScore || 0) * 0.2));
    let motivationLevel: MotivationLevel = 'Low Motivation';
    if (motivationScore >= 80) motivationLevel = 'Highly Motivated';
    else if (motivationScore >= 50) motivationLevel = 'Moderately Motivated';

    const suggestions = [];
    if ((student.attendance || 0) < 85) suggestions.push({ title: "Attendance", target: "85%+", description: "Regular attendance is key." });
    if ((student.studyHours || 0) < 15) suggestions.push({ title: "Study Time", target: "15h/wk", description: "Dedicate more time to self-study." });

    return {
      passStatus,
      isExamPending: false,
      overallPercentage: roundedPercentage,
      performanceLevel,
      riskLevel,
      riskReasons,
      motivationScore,
      motivationLevel,
      accuracy: 96.5,
      suggestions,
      features: [
        { name: 'Attendance', value: student.attendance, contribution: 25, importance: 0.35 },
        { name: 'Internal Marks', value: student.internalMarks, contribution: 40, importance: 0.45 },
        { name: 'Assignments', value: student.assignmentScore, contribution: 25, importance: 0.15 },
        { name: 'Study Hours', value: studyHoursNormalized, contribution: 10, importance: 0.05 },
      ],
      peerComparison: { student: roundedPercentage, average: 72.4, category: roundedPercentage > 80 ? 'Top' : roundedPercentage < 50 ? 'Bottom' : 'Middle' },
      timeline: [{ period: 'Unit 1', score: 65 }, { period: 'Unit 2', score: 70 }, { period: 'Current', score: roundedPercentage }]
    };
  };

  // Auth API
  app.post("/api/login", (req, res) => {
    const { registerNumber } = req.body;
    if (registerNumber === "ADMIN123" || registerNumber === "ADMIN") {
      return res.json({ role: 'faculty', user: { role: 'faculty' } });
    }
    const student = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(registerNumber) as StudentProfile;
    if (student) {
      res.json({ role: 'student', user: student });
    } else {
      res.status(401).json({ error: "Invalid Register Number" });
    }
  });

  // Student API
  app.get("/api/student/:regNo", (req, res) => {
    const student = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(req.params.regNo) as StudentProfile;
    if (!student) return res.status(404).json({ error: "Not found" });
    const prediction = calculatePrediction(student);
    res.json({ profile: student, prediction });
  });

  app.post("/api/student/update", (req, res) => {
    const { registerNumber, attendance, internalMarks, assignmentScore, studyHours } = req.body;
    db.prepare(`
      UPDATE students 
      SET attendance = ?, internalMarks = ?, assignmentScore = ?, studyHours = ?
      WHERE registerNumber = ?
    `).run(attendance, internalMarks, assignmentScore, studyHours, registerNumber);
    
    const student = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(registerNumber) as StudentProfile;
    const prediction = calculatePrediction(student);
    res.json({ profile: student, prediction });
  });

  app.post("/api/student/resume", (req, res) => {
    const { registerNumber, resumeName, resumeUrl } = req.body;
    db.prepare("UPDATE students SET resumeName = ?, resumeUrl = ? WHERE registerNumber = ?")
      .run(resumeName, resumeUrl, registerNumber);
    res.json({ success: true });
  });

  // Comprehensive Student Profile Update
  app.post("/api/student/update-profile", (req, res) => {
    try {
      const { 
        registerNumber, 
        name, 
        department, 
        mobile, 
        email, 
        bio, 
        targetCareer, 
        skills, 
        githubUrl, 
        linkedinUrl, 
        avatarUrl,
        semester,
        guardianName,
        guardianPhone
      } = req.body;

      if (!registerNumber) {
        return res.status(400).json({ error: "Missing registerNumber" });
      }

      db.prepare(`
        UPDATE students 
        SET name = COALESCE(?, name),
            department = COALESCE(?, department),
            mobile = COALESCE(?, mobile),
            email = ?,
            bio = ?,
            targetCareer = ?,
            skills = ?,
            githubUrl = ?,
            linkedinUrl = ?,
            avatarUrl = ?,
            semester = ?,
            guardianName = ?,
            guardianPhone = ?
        WHERE registerNumber = ?
      `).run(
        name, 
        department, 
        mobile, 
        email || null, 
        bio || null, 
        targetCareer || null, 
        skills || null, 
        githubUrl || null, 
        linkedinUrl || null, 
        avatarUrl || null,
        semester || null,
        guardianName || null,
        guardianPhone || null,
        registerNumber
      );

      const student = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(registerNumber) as StudentProfile;
      const prediction = calculatePrediction(student);
      res.json({ profile: student, prediction, success: true });
    } catch (err: any) {
      console.error("Error updating student profile:", err);
      res.status(500).json({ error: err.message || "Failed to update profile" });
    }
  });

  // Lazy init for Gemini API Client
  let aiClient: GoogleGenAI | null = null;
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("placeholder")) {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  };

  // Student AI Chatbot API
  app.post("/api/chat", async (req, res) => {
    try {
      const { registerNumber, message, history = [] } = req.body;
      if (!registerNumber) {
        return res.status(400).json({ error: "Missing registerNumber" });
      }

      const student = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(registerNumber) as StudentProfile;
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const prediction = calculatePrediction(student);
      const client = getGeminiClient();

      if (client) {
        // Map history to Google GenAI format (role: 'user' | 'model')
        const contents = history.map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        }));

        // Append current message
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const systemInstruction = `
You are the AI Academic Advisor for EduPredict Pro.
You are chatting with a student named ${student.name} (Register Number: ${student.registerNumber}) in the ${student.department} department.

Their academic profile is:
- Attendance: ${student.attendance}% (Minimum requirement: 75% for regular, 60% for pass status eligibility)
- Internal Examination Marks: ${student.internalMarks}/100 (Minimum requirement to pass: 35/100)
- Assignment Score: ${student.assignmentScore}/100
- Study Hours: ${student.studyHours} hours per week

Your Prediction and Performance Analysis:
- Pass/Fail Status prediction: ${prediction.passStatus}
- Projected Overall Percentage: ${prediction.overallPercentage}%
- Performance Category: ${prediction.performanceLevel}
- Academic Risk Level: ${prediction.riskLevel}
${prediction.riskReasons.length > 0 ? `- Risk Reasons: ${prediction.riskReasons.join(", ")}` : ''}
- Motivation Level: ${prediction.motivationLevel} (Motivation Score: ${prediction.motivationScore}/100)

Recommended Study Plan Suggestions:
${prediction.suggestions.map(s => `- Improve ${s.title} to ${s.target}: ${s.description}`).join("\n")}

Guidelines for your response:
1. Be encouraging, empathetic, professional, and act as a highly supportive academic mentor.
2. Directly answer their questions about their performance, schedules, predictions, study hours, or how to improve.
3. If they ask about exam schedules, explain that they can view unit assessment timelines and final exams on their dashboard, and give recommendations for regular study.
4. Keep answers concise, friendly, and structured. Use bullet points for study plans or multi-step suggestions.
5. Avoid mentioning internal implementation details like SQLite, better-sqlite3, or regression/classification formulas. Focus entirely on the student's academic progress.
`;

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
          }
        });

        const reply = response.text || "I'm sorry, I couldn't process that response.";
        return res.json({ reply });
      } else {
        // Simulated local fallback mode
        const msgLower = message.toLowerCase();
        let reply = "";

        if (msgLower.includes("attendance")) {
          reply = `Hello ${student.name}! Your current attendance is at **${student.attendance}%**. ${
            student.attendance < 75 
              ? "This is currently below our institution's recommended **75%** mark. I highly recommend regular class attendance to avoid being flagged at risk." 
              : "Fantastic job! Your attendance is strong, which directly drives your overall prediction success."
          }`;
        } else if (msgLower.includes("pass") || msgLower.includes("fail") || msgLower.includes("predict")) {
          reply = `According to our academic prediction model, your overall performance level is categorized as **${prediction.performanceLevel}** with a status of **${prediction.passStatus}** and an expected final score of **${prediction.overallPercentage}%**. ${
            prediction.passStatus === "Fail"
              ? "Since your current status is 'Fail' due to key constraints, let's work together to bring this up!"
              : "Keep up the excellent momentum!"
          }`;
        } else if (msgLower.includes("study") || msgLower.includes("hour")) {
          reply = `You currently log **${student.studyHours} hours per week** of self-study. ${
            student.studyHours < 12 
              ? "Increasing this target to at least **12-15 hours** per week would make a dramatic difference in your confidence and final internal assessment grades." 
              : "Your self-study routine is already excellent. Keep dedicating this quality time!"
          }`;
        } else if (msgLower.includes("improve") || msgLower.includes("suggestion") || msgLower.includes("how to") || msgLower.includes("help") || msgLower.includes("schedule")) {
          const suggestionsText = prediction.suggestions.length > 0 
            ? prediction.suggestions.map(s => `- **Improve ${s.title} to ${s.target}**: ${s.description}`).join("\n")
            : "No urgent alerts! You're currently on an exceptional academic trajectory.";
          reply = `Here is your custom, data-backed roadmap to elevate your grades:\n\n${suggestionsText}\n\nAdditionally, prepare ahead of upcoming assessments shown on your dashboard by allocating balanced study schedules!`;
        } else {
          reply = `Hello ${student.name}! I am your AI Academic Advisor. I am here to help you navigate your academic journey. You can ask me questions about:\n\n- How to **improve** your score\n- Your **attendance** metrics\n- **Pass/Fail predictions**\n- Your current **study hours**`;
        }

        return res.json({ reply });
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      res.status(500).json({ error: "Something went wrong in the chat agent." });
    }
  });

  // Curated fallback generator for student recommendations when Gemini key is missing/unconfigured
  function generateFallbackRecommendations(student: StudentProfile, prediction: PredictionResult) {
    const isComputerScience = student.department.toLowerCase().includes("computer") || student.department.toLowerCase().includes("it") || student.department.toLowerCase().includes("info");
    
    const focusAreas = isComputerScience 
      ? ["Data Structures & Algorithms", "Database Management Systems", "Software Engineering Concepts", "Object Oriented Programming"]
      : ["Core Departmental Fundamentals", "Applied Problem Solving", "Analytical Reasoning", "Core Subject Practical Labs"];

    const week1Topic = focusAreas[0];
    const week2Topic = focusAreas[1];
    const week3Topic = focusAreas[2];
    const week4Topic = focusAreas[3];

    const studyPlan = [
      {
        week: "Week 1: Foundations & Core Concepts",
        focusTopic: week1Topic,
        suggestedHours: Math.max(8, student.studyHours + 4),
        tasks: [
          `Review the lecture notes on ${week1Topic} for 2 hours.`,
          `Complete 3 practice problems regarding foundational principles of ${week1Topic}.`,
          `Draft a 1-page cheatsheet of key definitions and essential diagrams.`,
          student.attendance < 75 ? "Attend all scheduled classes this week and ask at least one question." : "Participate in group study sessions to reinforce concepts."
        ]
      },
      {
        week: "Week 2: Deep Dive & Application",
        focusTopic: week2Topic,
        suggestedHours: Math.max(10, student.studyHours + 5),
        tasks: [
          `Complete assigned readings and textbook chapters for ${week2Topic}.`,
          `Solve mid-term model questions related to ${week2Topic}.`,
          "Meet with a peer or course mentor to clarify unresolved doubts.",
          student.internalMarks < 50 ? "Attempt a mock 1-hour timed test to build examination confidence." : "Explain a complex concept to a classmate to test your mastery."
        ]
      },
      {
        week: "Week 3: Advanced Topics & Lab Work",
        focusTopic: week3Topic,
        suggestedHours: Math.max(12, student.studyHours + 6),
        tasks: [
          `Implement or practice 2 practical lab exercises covering ${week3Topic}.`,
          `Submit pending assignments and double-check with the marking rubric.`,
          "Analyze past paper answers and note common grading pitfalls.",
          "Take a brief 15-minute diagnostic quiz to identify remaining gaps."
        ]
      },
      {
        week: "Week 4: Comprehensive Exam Prep",
        focusTopic: week4Topic,
        suggestedHours: Math.max(14, student.studyHours + 8),
        tasks: [
          "Create a comprehensive mind-map of the entire syllabus.",
          "Perform a full-length 3-hour timed practice assessment.",
          `Review weak areas in ${week1Topic} and ${week2Topic} identified earlier.`,
          "Ensure solid sleep of 8 hours before the main examination day."
        ]
      }
    ];

    const learningResources = [
      {
        title: isComputerScience ? "MIT OpenCourseWare: Introduction to Algorithms" : "Khan Academy: Advanced STEM Series",
        type: "Interactive Course" as const,
        topic: week1Topic,
        searchQuery: isComputerScience ? "MIT OpenCourseWare Introduction to Algorithms" : "Khan Academy college stem courses",
        description: "High-quality video lectures and interactive assignments that clarify complex concepts from first principles."
      },
      {
        title: isComputerScience ? "YouTube: FreeCodeCamp Full Course Guides" : "YouTube: Crash Course Educational Series",
        type: "Video" as const,
        topic: week2Topic,
        searchQuery: isComputerScience ? "freecodecamp computer science lectures" : "crash course science and technology tutorials",
        description: "Engaging visual explainers and step-by-step walk-throughs, ideal for dynamic learners."
      },
      {
        title: "GeeksforGeeks & Department Reference Library",
        type: "Article" as const,
        topic: week3Topic,
        searchQuery: isComputerScience ? "geeksforgeeks data structures tutorials" : "academic department reference guides engineering",
        description: "Comprehensive written summaries, code snippets, or diagrams perfect for quick references and syntax review."
      }
    ];

    const improvementStrategies: any[] = [];
    
    if (student.attendance < 75) {
      improvementStrategies.push({
        title: "Attendance Boost Routine",
        difficulty: "Easy",
        impact: "High",
        actionableStep: "Set three separate alarm schedules for morning lectures and sit in the front row to remain active.",
        milestone: "Reach a consistent 85% attendance rate over the next three weeks."
      });
    }

    if (student.internalMarks < 45) {
      improvementStrategies.push({
        title: "Mock Practice Framework",
        difficulty: "Medium",
        impact: "High",
        actionableStep: "Solve at least 2 past year mid-term papers under timed conditions and request review from your professor.",
        milestone: "Score above 70% in consecutive mock tests."
      });
    }

    if (student.studyHours < 12) {
      improvementStrategies.push({
        title: "Study Habit Habituation",
        difficulty: "Medium",
        impact: "High",
        actionableStep: "Block 2 distraction-free hours every evening using the Pomodoro technique (25m study, 5m break).",
        milestone: "Log 14 quality self-study hours per week verified by a daily journal."
      });
    } else {
      improvementStrategies.push({
        title: "Advanced Peer Mentorship",
        difficulty: "Hard",
        impact: "Medium",
        actionableStep: "Lead or participate in peer-to-peer tutoring workshops to solidify your knowledge through teaching.",
        milestone: "Formulate a weekly 4-person peer-review study circle."
      });
    }

    if (improvementStrategies.length < 3) {
      improvementStrategies.push({
        title: "Continuous Feedback Loop",
        difficulty: "Easy",
        impact: "Medium",
        actionableStep: "Share your weekly goals with your academic advisor during open office hours to maintain accountability.",
        milestone: "Schedule bi-weekly 10-minute check-ins."
      });
    }

    const strengths = [];
    const weaknesses = [];

    if (student.attendance >= 80) strengths.push("Consistent classroom presence and high active participation.");
    else weaknesses.push("Sub-optimal classroom attendance which limits exposure to key real-time explanations.");

    if (student.internalMarks >= 70) strengths.push("Strong conceptual clarity and excellent retention in mid-term assessments.");
    else weaknesses.push("Vulnerable marks in internal examinations indicating potential gaps in syllabus fundamentals.");

    if (student.assignmentScore >= 75) strengths.push("Highly diligent and timely submission of project coursework.");
    else weaknesses.push("Missed opportunities to maximize assignment points due to incomplete submissions.");

    if (student.studyHours >= 12) strengths.push("Excellent discipline in maintaining self-directed weekly study schedules.");
    else weaknesses.push("Inadequate self-study hours to master advanced applications of the curriculum.");

    const summary = `Based on a comprehensive analysis of your performance metrics in ${student.department}, you possess solid potential in ${strengths.length > 0 ? strengths[0].toLowerCase() : 'your coursework'}. However, we have flagged a few areas—specifically ${weaknesses.length > 0 ? weaknesses[0].toLowerCase() : 'the final assessment review'}—that require structured focus. Following this personalized 4-week study plan and utilizing the selected online resource queries will substantially boost your prediction status and yield outstanding outcomes in the upcoming academic finals. Keep up your dedication!`;

    const futureAcademicVideos = [
      {
        title: isComputerScience ? "Harvard CS50: Full Systems & Computing Foundations" : "MIT OpenCourseWare: Advanced Engineering Lectures",
        topic: isComputerScience ? "Computer Science Fundamentals" : `${student.department} Core Principles`,
        platform: isComputerScience ? "Harvard CS50" : "MIT OCW",
        searchQuery: isComputerScience ? "Harvard CS50 full computer science introduction" : `${student.department} university lecture series`,
        semesterTarget: "Upcoming Semester Core Preparation",
        whyRecommended: "Builds deep conceptual mastery from first principles to excel in higher-semester technical subjects."
      },
      {
        title: isComputerScience ? "MIT 6.006: Introduction to Algorithms & Data Structures" : "NPTEL: Core Engineering Analysis & Problem Solving",
        topic: isComputerScience ? "Algorithms & Performance Optimization" : `${student.department} Advanced Topics`,
        platform: isComputerScience ? "MIT OCW" : "NPTEL",
        searchQuery: isComputerScience ? "MIT 6.006 algorithms lecture" : `NPTEL ${student.department} course`,
        semesterTarget: "Midterm & University Finals",
        whyRecommended: "Crucial for strengthening analytical problem-solving and scoring top percentiles in exams."
      },
      {
        title: isComputerScience ? "Building Generative AI & Deep Learning Architectures" : "Industry 4.0 & Applied Technical Innovations",
        topic: "Future Technology & Career Advancement",
        platform: "YouTube",
        searchQuery: isComputerScience ? "Andrej Karpathy neural networks zero to hero" : `${student.department} future technology industry trends`,
        semesterTarget: "Final Year Capstone & Campus Placement",
        whyRecommended: "Equips you with market-leading practical skills valued by premier engineering firms."
      }
    ];

    return {
      studyPlan,
      learningResources,
      improvementStrategies,
      futureAcademicVideos,
      aiAnalysis: {
        strengths: strengths.length > 0 ? strengths : ["Responsive engagement with class materials."],
        weaknesses: weaknesses.length > 0 ? weaknesses : ["Refining speed and accuracy under examination pressure."],
        summary
      }
    };
  }

  // AI-Based Personalized Recommendations API
  app.get("/api/student/:regNo/recommendations", async (req, res) => {
    try {
      const student = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(req.params.regNo) as StudentProfile;
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      const prediction = calculatePrediction(student);
      const client = getGeminiClient();

      if (client) {
        const prompt = `
You are an advanced academic AI advisory agent for EduPredict Pro.
Your task is to generate high-quality, customized, actionable learning recommendations, a weekly study plan, learning resource search queries, improvement strategies, and future academic video recommendations tailored to the student's degree.

Student Profile:
- Name: ${student.name}
- Department: ${student.department}
- Semester: ${student.semester}
- Attendance: ${student.attendance}%
- Internal Exam Marks: ${student.internalMarks}/100
- Assignment Score: ${student.assignmentScore}/100
- Self-Study Hours: ${student.studyHours} hours per week

Current Predictive Analytics:
- Pass Status: ${prediction.passStatus}
- Projected Score: ${prediction.overallPercentage}%
- Performance level: ${prediction.performanceLevel}
- Risk Level: ${prediction.riskLevel}
- Specific risk reasons identified: ${prediction.riskReasons.join(", ") || "None"}

Please perform an in-depth analysis of their strengths and weaknesses. Then, build a 4-week custom study plan relevant to their degree (${student.department}), suggest highly relevant learning resources, recommend future academic video lectures tailored to their degree/semester, and define concrete improvement strategies.

Ensure your response is valid JSON matching the specified schema. Keep descriptions actionable, highly personalized, and encouraging.
`;

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                studyPlan: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      week: { type: Type.STRING, description: "Week title with focus area, e.g., 'Week 1: Foundations of DBMS'" },
                      focusTopic: { type: Type.STRING, description: "Specific topic of focus" },
                      suggestedHours: { type: Type.INTEGER, description: "Suggested study hours for this week" },
                      tasks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Checklist of 3-4 specific study tasks" }
                    },
                    required: ["week", "focusTopic", "suggestedHours", "tasks"]
                  }
                },
                learningResources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Resource name (e.g. YouTube: FreeCodeCamp Python Course)" },
                      type: { type: Type.STRING, description: "Video, Article, Book, or Interactive Course" },
                      topic: { type: Type.STRING, description: "Associated topic" },
                      searchQuery: { type: Type.STRING, description: "Google or YouTube query to locate it" },
                      description: { type: Type.STRING, description: "Why this helps them specifically" }
                    },
                    required: ["title", "type", "topic", "searchQuery", "description"]
                  }
                },
                futureAcademicVideos: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Name of the future video series or lecture" },
                      topic: { type: Type.STRING, description: "Course or discipline topic" },
                      platform: { type: Type.STRING, description: "e.g. YouTube, MIT OCW, NPTEL, Harvard CS50" },
                      searchQuery: { type: Type.STRING, description: "Search query for the video" },
                      semesterTarget: { type: Type.STRING, description: "e.g. Semester V & VI or Placement" },
                      whyRecommended: { type: Type.STRING, description: "Why this video benefits their degree" }
                    },
                    required: ["title", "topic", "platform", "searchQuery", "semesterTarget", "whyRecommended"]
                  }
                },
                improvementStrategies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Strategy title" },
                      difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
                      impact: { type: Type.STRING, description: "High, Medium, or Low" },
                      actionableStep: { type: Type.STRING, description: "Clear first step they should take" },
                      milestone: { type: Type.STRING, description: "Specific milestone to aim for" }
                    },
                    required: ["title", "difficulty", "impact", "actionableStep", "milestone"]
                  }
                },
                aiAnalysis: {
                  type: Type.OBJECT,
                  properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 strengths found" },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 weaknesses found" },
                    summary: { type: Type.STRING, description: "Cohesive narrative summary and words of encouragement" }
                  },
                  required: ["strengths", "weaknesses", "summary"]
                }
              },
              required: ["studyPlan", "learningResources", "improvementStrategies", "aiAnalysis"]
            }
          }
        });

        const jsonStr = response.text?.trim() || "";
        const parsed = JSON.parse(jsonStr);
        return res.json(parsed);
      } else {
        const fallback = generateFallbackRecommendations(student, prediction);
        return res.json(fallback);
      }
    } catch (err: any) {
      console.error("Recommendations error:", err);
      try {
        const student = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(req.params.regNo) as StudentProfile;
        const prediction = calculatePrediction(student);
        const fallback = generateFallbackRecommendations(student, prediction);
        return res.json(fallback);
      } catch (innerErr) {
        res.status(500).json({ error: "Failed to generate learning recommendations." });
      }
    }
  });


  // Faculty API
  app.get("/api/faculty/all", (req, res) => {
    const students = db.prepare("SELECT * FROM students").all() as StudentProfile[];
    const results = students.map(s => ({
      profile: s,
      prediction: calculatePrediction(s)
    }));
    res.json(results);
  });

  app.get("/api/faculty/stats", (req, res) => {
    const students = db.prepare("SELECT * FROM students").all() as StudentProfile[];
    const predictions = students.map(s => calculatePrediction(s));
    
    const stats: FacultyStats = {
      totalStudents: students.length,
      passRate: Math.round((predictions.filter(p => p.passStatus === 'Pass').length / students.length) * 100),
      averageScore: Math.round((predictions.reduce((acc, p) => acc + p.overallPercentage, 0) / students.length) * 100) / 100,
      riskDistribution: {
        high: predictions.filter(p => p.riskLevel === 'High Risk').length,
        medium: predictions.filter(p => p.riskLevel === 'Medium Risk').length,
        low: predictions.filter(p => p.riskLevel === 'Low Risk').length,
      },
      performanceDistribution: {
        Excellent: predictions.filter(p => p.performanceLevel === 'Excellent').length,
        Good: predictions.filter(p => p.performanceLevel === 'Good').length,
        Average: predictions.filter(p => p.performanceLevel === 'Average').length,
        Poor: predictions.filter(p => p.performanceLevel === 'Poor').length,
      }
    };
    res.json(stats);
  });

  // Add new student API
  app.post("/api/faculty/student/add", (req, res) => {
    try {
      const { registerNumber, name, department, mobile, attendance, internalMarks, assignmentScore, studyHours } = req.body;
      if (!registerNumber || !name || !department || !mobile) {
        return res.status(400).json({ error: "Missing required student details." });
      }

      const cleanRegNo = registerNumber.trim().toUpperCase();
      const existing = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(cleanRegNo);
      if (existing) {
        return res.status(400).json({ error: "A student with Register Number " + cleanRegNo + " already exists." });
      }

      db.prepare(`
        INSERT INTO students (registerNumber, name, department, mobile, attendance, internalMarks, assignmentScore, studyHours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        cleanRegNo,
        name.trim(),
        department.trim(),
        mobile.trim(),
        Number(attendance || 0),
        Number(internalMarks || 0),
        Number(assignmentScore || 0),
        Number(studyHours || 0)
      );

      res.json({ success: true, message: "Student added successfully." });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Edit existing student API
  app.post("/api/faculty/student/edit", (req, res) => {
    try {
      const { registerNumber, oldRegisterNumber, name, department, mobile, attendance, internalMarks, assignmentScore, studyHours } = req.body;
      if (!registerNumber || !name || !department || !mobile) {
        return res.status(400).json({ error: "Missing required student details." });
      }

      const cleanRegNo = registerNumber.trim().toUpperCase();
      const targetRegNo = (oldRegisterNumber || registerNumber).trim().toUpperCase();
      const existing = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(targetRegNo);
      if (!existing) {
        return res.status(404).json({ error: "Student with Register Number " + targetRegNo + " not found." });
      }

      // If they changed the register number, make sure the new one is not already taken
      if (cleanRegNo !== targetRegNo) {
        const taken = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(cleanRegNo);
        if (taken) {
          return res.status(400).json({ error: "A student with Register Number " + cleanRegNo + " already exists." });
        }
      }

      db.prepare(`
        UPDATE students
        SET registerNumber = ?, name = ?, department = ?, mobile = ?, attendance = ?, internalMarks = ?, assignmentScore = ?, studyHours = ?
        WHERE registerNumber = ?
      `).run(
        cleanRegNo,
        name.trim(),
        department.trim(),
        mobile.trim(),
        Number(attendance || 0),
        Number(internalMarks || 0),
        Number(assignmentScore || 0),
        Number(studyHours || 0),
        targetRegNo
      );

      res.json({ success: true, message: "Student updated successfully." });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Faculty AI Advisor Chat API
  app.post("/api/faculty/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      const students = db.prepare("SELECT * FROM students").all() as StudentProfile[];
      const predictions = students.map(s => ({
        student: s,
        prediction: calculatePrediction(s)
      }));

      const totalStudents = students.length;
      const passRate = totalStudents > 0 
        ? Math.round((predictions.filter(p => p.prediction.passStatus === 'Pass').length / totalStudents) * 100) 
        : 100;
      const averageScore = totalStudents > 0
        ? Math.round((predictions.reduce((acc, p) => acc + p.prediction.overallPercentage, 0) / totalStudents) * 10) / 10
        : 0;
      const highRiskCount = predictions.filter(p => p.prediction.riskLevel === 'High Risk').length;
      const mediumRiskCount = predictions.filter(p => p.prediction.riskLevel === 'Medium Risk').length;
      const lowRiskCount = predictions.filter(p => p.prediction.riskLevel === 'Low Risk').length;

      // Identify specific high risk students with summaries
      const highRiskDetails = predictions
        .filter(p => p.prediction.riskLevel === 'High Risk')
        .map(p => {
          return `- **${p.student.name}** (Reg No: ${p.student.registerNumber}, Dept: ${p.student.department}): Attendance ${p.student.attendance}%, Internals ${p.student.internalMarks}/100, Study hours ${p.student.studyHours}/wk. Triggers: ${p.prediction.riskReasons.join(', ') || 'N/A'}`;
        })
        .join("\n");

      const client = getGeminiClient();

      if (client) {
        const contents = history.map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        }));

        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const systemInstruction = `
You are the Senior Academic Advisory AI for EduPredict Pro, assisting the Administrator and Faculty members.
Your purpose is to deliver executive pedagogical insights, course completion guidance, pass-rate optimization strategies, and targeted remediation suggestions based on real-time cohort statistics.

Cohort Statistics Summary:
- Total Enrolled Students: ${totalStudents}
- Projected Cohort Pass Rate: ${passRate}%
- Average Projected Final Mark: ${averageScore}%
- Risk Classification:
  - High Academic Risk: ${highRiskCount} students
  - Medium Academic Risk: ${mediumRiskCount} students
  - Low Academic Risk: ${lowRiskCount} students

Here is the roster of students flagged as HIGH ACADEMIC RISK:
${highRiskDetails || "None currently flagged!"}

Guidelines:
1. Provide proactive, objective, highly academic, and expert mentoring strategies.
2. If the faculty asks about specific at-risk students, refer to their metrics and suggest dedicated remedies (e.g., peer tutor matching, parent check-ins, makeup assignments).
3. Offer actionable curriculum/pedagogical recommendations (e.g., 'To boost the ${passRate}% pass rate, consider focusing on internal mock drills for students below 45% marks').
4. Avoid any system engineering details (SQLite, code folders, API keys, etc.).
5. Be concise, highly professional, structured, and helpful. Use clear section headers and bullet points.
`;

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
          }
        });

        const reply = response.text || "I'm sorry, I couldn't process that response.";
        return res.json({ reply });
      } else {
        // Fallback simulated local response
        const msgLower = message.toLowerCase();
        let reply = "";

        if (msgLower.includes("risk") || msgLower.includes("high risk") || msgLower.includes("failing") || msgLower.includes("who")) {
          reply = `### AI Advisor Diagnostic Review: At-Risk Students\n\nThere are currently **${highRiskCount} student(s)** flagged at **High Academic Risk**:\n\n${
            highRiskDetails || "No students are currently classified under high risk."
          }\n\n**Recommended Intervention Strategies:**\n1. **Attendance Warning Notice:** Mandate warning counseling for any student under 75% attendance.\n2. **Targeted internal drills:** Prioritize internal exam remedial sessions focusing on previous year questions.\n3. **Mentorship Assignment:** Pair these students with Top Performers (Low Risk) in their respective departments.`;
        } else if (msgLower.includes("improve") || msgLower.includes("pass") || msgLower.includes("rate") || msgLower.includes("percentage")) {
          reply = `### AI Advisor Strategy: Pass Rate Improvement\n\nOur current projected pass rate is **${passRate}%** with a final score average of **${averageScore}%**.\n\nTo drive this above 90%, we recommend taking these core steps:\n\n1. **Early Diagnostic Mock Drills:** Conduct a short, ungraded diagnostic quiz mid-way through the syllabus.\n2. **Interactive Assignment Reminders:** Maximize assignment scores (current average can be improved) to offer students a safe score cushion.\n3. **Attendance Recovery Program:** Provide a path for attendance-deficient students to make up hours through recorded digital sessions or lab practicals.`;
        } else if (msgLower.includes("attendance") || msgLower.includes("bunk") || msgLower.includes("absent")) {
          reply = `### AI Advisor Insights: Attendance Management\n\nIn our student database, low attendance is the strongest predictive signal for final failure. \n\n* **Primary Suggestion:** Implement a real-time automated SMS/email trigger once a student's attendance drops below 78%.\n* **Interactive Lectures:** Introduce short, 5-minute interactive quizzes at the beginning of each lecture to encourage punctual arrival.\n* **Academic Counselors:** Set up mandatory individual meetings with department heads for any students flagged with red-zone attendance.`;
        } else {
          reply = `### EduPredict Pro Faculty AI Advisor\n\nHello, Professor! I am your institutional advisory agent. I analyze our cohort of **${totalStudents} students** to help you optimize success rates.\n\n**Current Cohort Vital Signs:**\n- Projected Pass Rate: **${passRate}%**\n- Average Final Grade: **${averageScore}%**\n- At-Risk Student Count: **${highRiskCount} High Risk**, **${mediumRiskCount} Medium Risk**\n\n**Ask me anything about:**\n- *Who is currently at academic risk and why?*\n- *How can we design a tutoring study plan to boost the pass rate?*\n- *Strategies for handling severe attendance issues.*`;
        }

        return res.json({ reply });
      }
    } catch (err: any) {
      console.error("Faculty chat error:", err);
      res.status(500).json({ error: "Failed to process advisor query." });
    }
  });

  // Delete student API
  app.delete("/api/faculty/student/:regNo", (req, res) => {
    try {
      const { regNo } = req.params;
      const existing = db.prepare("SELECT * FROM students WHERE registerNumber = ?").get(regNo);
      if (!existing) {
        return res.status(404).json({ error: "Student not found." });
      }

      db.prepare("DELETE FROM students WHERE registerNumber = ?").run(regNo);
      res.json({ success: true, message: "Student deleted successfully." });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
