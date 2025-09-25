export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'coordinator';
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  students: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxPoints: number;
  createdAt: Date;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt?: Date;
  grade?: number;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  feedback?: string;
}

export interface Attendance {
  id: string;
  courseId: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'announcement' | 'reminder';
  read: boolean;
  createdAt: Date;
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  assignmentsCompleted: number;
  totalAssignments: number;
  averageGrade: number;
  attendanceRate: number;
  lastActivity: Date;
}
