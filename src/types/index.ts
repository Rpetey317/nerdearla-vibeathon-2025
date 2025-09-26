export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'coordinator';
  avatar?: string;
  cellId?: string; // For teachers - which cell they manage
  assignedTeacherId?: string; // For students - which teacher they're assigned to
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
  status: 'sin_entregar' | 'borrador' | 'entregado' | 'evaluado' | 'tarde' | 'asignado';
  feedback?: string;
  cellId?: string; // Which cell this student belongs to
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
  type: 'assignment' | 'grade' | 'announcement' | 'reminder' | 'late_delivery' | 'cell_alert';
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
  cellId?: string;
}

// New interface for Semillero's cell structure
export interface Cell {
  id: string;
  name: string;
  teacherId: string;
  courseId: string;
  studentIds: string[];
  createdAt: Date;
}

// Metrics interface for coordinator dashboard
export interface CellMetrics {
  cellId: string;
  cellName: string;
  teacherName: string;
  totalStudents: number;
  totalDeliveries: number;
  lateDeliveries: number;
  pendingAssignments: number;
  averageGrade: number;
  completionRate: number;
}

// Extended assignment interface for teacher cell view
export interface StudentAssignment {
  id: string;
  title: string;
  status: 'sin_entregar' | 'borrador' | 'entregado' | 'evaluado' | 'tarde' | 'asignado';
  grade: number | null | undefined;
  dueDate: Date;
}

// Student with assignments for teacher cell view
export interface CellStudent {
  id: string;
  name: string;
  email: string;
  assignments: StudentAssignment[];
  completionRate: number;
  averageGrade: number;
  lastActivity: Date;
}

// Teacher cell data structure
export interface TeacherCell {
  id: string;
  name: string;
  teacherName: string;
  courseId: string;
  courseName: string;
  students: CellStudent[];
}
