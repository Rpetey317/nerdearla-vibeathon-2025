import { Course, Assignment, Submission, User, StudentProgress, Notification } from '@/types';
import { 
  mockUsersEnhanced, 
  mockCoursesEnhanced, 
  mockAssignmentsEnhanced, 
  mockSubmissionsEnhanced, 
  mockStudentProgressEnhanced, 
  mockNotificationsEnhanced 
} from './mockDataEnhanced';
import { 
  fetchAllCoursesWithData as fetchRealData, 
  calculateStudentProgress as calculateRealProgress, 
  generateNotifications as generateRealNotifications 
} from './data-service';

const USE_MOCKS = process.env.USE_MOCKS === 'true';

export async function fetchAllCoursesWithData(): Promise<{
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  students: User[];
}> {
  if (USE_MOCKS) {
    // Return enhanced mock data
    return {
      courses: mockCoursesEnhanced,
      assignments: mockAssignmentsEnhanced,
      submissions: mockSubmissionsEnhanced,
      students: mockUsersEnhanced.filter(u => u.role === 'student')
    };
  } else {
    // Use real Google Classroom data
    return await fetchRealData();
  }
}

export function calculateStudentProgress(
  courses: Course[],
  assignments: Assignment[],
  submissions: Submission[]
): StudentProgress[] {
  if (USE_MOCKS) {
    return mockStudentProgressEnhanced;
  } else {
    return calculateRealProgress(courses, assignments, submissions);
  }
}

export function generateNotifications(
  assignments: Assignment[],
  submissions: Submission[],
  students: User[]
): Notification[] {
  if (USE_MOCKS) {
    return mockNotificationsEnhanced;
  } else {
    return generateRealNotifications(assignments, submissions, students);
  }
}

// Additional helper functions for enhanced mock data
export function getAllUsers(): User[] {
  if (USE_MOCKS) {
    return mockUsersEnhanced;
  } else {
    // In production, this would fetch from your user management system
    // For now, return empty array when not using mocks
    return [];
  }
}

export function getUsersByRole(role: 'student' | 'teacher' | 'coordinator'): User[] {
  return getAllUsers().filter(user => user.role === role);
}

export function getTeacherCell(teacherId: string) {
  if (!USE_MOCKS) {
    return null; // In production, fetch from database
  }

  const teacher = mockUsersEnhanced.find(u => u.id === teacherId && u.role === 'teacher');
  if (!teacher?.cellId) return null;

  const cellStudents = mockUsersEnhanced.filter(u => u.cellId === teacher.cellId && u.role === 'student');
  const course = mockCoursesEnhanced.find(c => c.students.some(s => cellStudents.map(cs => cs.id).includes(s)));
  
  if (!course) return null;

  const assignments = mockAssignmentsEnhanced.filter(a => a.courseId === course.id);
  
  return {
    id: teacher.cellId,
    name: `Célula ${teacher.cellId.split('-')[1].toUpperCase()} - ${course.name.split(' ')[0]}`,
    teacherName: teacher.name,
    courseId: course.id,
    courseName: course.name,
    students: cellStudents.map(student => {
      const studentAssignments = assignments.map(assignment => {
        const submission = mockSubmissionsEnhanced.find(
          s => s.assignmentId === assignment.id && s.studentId === student.id
        );
        return {
          id: assignment.id,
          title: assignment.title,
          status: submission?.status || 'asignado',
          grade: submission?.grade,
          dueDate: assignment.dueDate
        };
      });

      const completedAssignments = studentAssignments.filter(
        a => a.status === 'evaluado' || a.status === 'entregado'
      ).length;
      const completionRate = (completedAssignments / assignments.length) * 100;
      
      const gradedAssignments = studentAssignments.filter(a => a.grade !== undefined);
      const averageGrade = gradedAssignments.length > 0 
        ? gradedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) / gradedAssignments.length 
        : 0;

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        assignments: studentAssignments,
        completionRate,
        averageGrade,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      };
    })
  };
}

export function getCellMetrics() {
  if (!USE_MOCKS) {
    return []; // In production, calculate from real data
  }

  const teachers = mockUsersEnhanced.filter(u => u.role === 'teacher');
  
  return teachers.map(teacher => {
    const cellData = getTeacherCell(teacher.id);
    if (!cellData) return null;

    const totalDeliveries = cellData.students.reduce((sum, student) => 
      sum + student.assignments.filter(a => a.status === 'entregado' || a.status === 'evaluado').length, 0
    );
    
    const lateDeliveries = cellData.students.reduce((sum, student) => 
      sum + student.assignments.filter(a => a.status === 'tarde').length, 0
    );
    
    const pendingAssignments = cellData.students.reduce((sum, student) => 
      sum + student.assignments.filter(a => a.status === 'asignado' || a.status === 'sin_entregar').length, 0
    );

    const averageGrade = cellData.students.reduce((sum, student) => sum + student.averageGrade, 0) / cellData.students.length;
    const completionRate = cellData.students.reduce((sum, student) => sum + student.completionRate, 0) / cellData.students.length;

    return {
      cellId: teacher.cellId!,
      cellName: cellData.name,
      teacherName: teacher.name,
      totalStudents: cellData.students.length,
      totalDeliveries,
      lateDeliveries,
      pendingAssignments,
      averageGrade,
      completionRate
    };
  }).filter(Boolean);
}

// Check if we're using mocks (useful for UI components)
export function isUsingMocks(): boolean {
  return USE_MOCKS;
}
