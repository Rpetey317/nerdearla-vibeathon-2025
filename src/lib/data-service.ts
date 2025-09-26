import { Course, Assignment, Submission, User, StudentProgress, Notification } from '@/types';

// Helper function to safely convert date strings to Date objects
function safeParseDate(dateInput: any): Date {
  if (!dateInput || dateInput === null || dateInput === undefined) {
    return new Date();
  }
  
  if (dateInput instanceof Date) {
    // Check if it's a valid Date object
    if (isNaN(dateInput.getTime())) {
      console.warn('Invalid Date object:', dateInput);
      return new Date();
    }
    return dateInput;
  }
  
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date input:', dateInput);
      return new Date();
    }
    return date;
  } catch (error) {
    console.warn('Error parsing date:', dateInput, error);
    return new Date();
  }
}

// Client-side data fetching functions
export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch('/api/classroom/courses');
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  const data = await response.json();
  
  // Convert date strings back to Date objects
  return data.map((course: any) => ({
    ...course,
    createdAt: safeParseDate(course.createdAt),
    updatedAt: safeParseDate(course.updatedAt),
  }));
}

export async function fetchCourseStudents(courseId: string): Promise<any[]> {
  const response = await fetch(`/api/classroom/courses/${courseId}/students`);
  if (!response.ok) {
    throw new Error('Failed to fetch course students');
  }
  return response.json();
}

export async function fetchCourseWork(courseId: string): Promise<Assignment[]> {
  const response = await fetch(`/api/classroom/courses/${courseId}/coursework`);
  if (!response.ok) {
    throw new Error('Failed to fetch course work');
  }
  const data = await response.json();
  
  // Convert date strings back to Date objects
  return data.map((assignment: any) => ({
    ...assignment,
    dueDate: safeParseDate(assignment.dueDate),
    createdAt: safeParseDate(assignment.createdAt),
  }));
}

export async function fetchSubmissions(courseId: string): Promise<Submission[]> {
  const response = await fetch(`/api/classroom/courses/${courseId}/submissions`);
  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }
  const data = await response.json();
  
  // Convert date strings back to Date objects
  return data.map((submission: any) => ({
    ...submission,
    submittedAt: submission.submittedAt ? safeParseDate(submission.submittedAt) : undefined,
  }));
}

// Aggregate data functions
export async function fetchAllCoursesWithData(): Promise<{
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  students: User[];
}> {
  try {
    const courses = await fetchCourses();
    
    // Fetch data for all courses in parallel
    const courseDataPromises = courses.map(async (course) => {
      const [students, assignments, submissions] = await Promise.all([
        fetchCourseStudents(course.id),
        fetchCourseWork(course.id),
        fetchSubmissions(course.id),
      ]);
      
      return { course, students, assignments, submissions };
    });
    
    const courseData = await Promise.all(courseDataPromises);
    
    // Aggregate all data
    const allAssignments: Assignment[] = [];
    const allSubmissions: Submission[] = [];
    const allStudents: User[] = [];
    const studentMap = new Map<string, User>();
    
    courseData.forEach(({ course, students, assignments, submissions }) => {
      // Update course with student IDs and ensure dates are Date objects
      course.students = students.map(s => s.profile?.id || s.userId);
      course.createdAt = safeParseDate(course.createdAt);
      course.updatedAt = safeParseDate(course.updatedAt);
      
      // Add assignments with proper date conversion
      const processedAssignments = assignments.map((assignment: any) => ({
        ...assignment,
        dueDate: safeParseDate(assignment.dueDate),
        createdAt: safeParseDate(assignment.createdAt),
      }));
      allAssignments.push(...processedAssignments);
      
      // Add submissions with proper date conversion
      const processedSubmissions = submissions.map((submission: any) => ({
        ...submission,
        submittedAt: submission.submittedAt ? safeParseDate(submission.submittedAt) : undefined,
      }));
      allSubmissions.push(...processedSubmissions);
      
      // Add unique students
      students.forEach(student => {
        const profile = student.profile;
        if (profile && !studentMap.has(profile.id)) {
          const user: User = {
            id: profile.id,
            email: profile.emailAddress,
            name: profile.name?.fullName || 'Unknown',
            role: 'student',
            avatar: profile.photoUrl,
          };
          studentMap.set(profile.id, user);
          allStudents.push(user);
        }
      });
    });
    
    return {
      courses,
      assignments: allAssignments,
      submissions: allSubmissions,
      students: allStudents,
    };
  } catch (error) {
    console.error('Error fetching classroom data:', error);
    throw error;
  }
}

// Calculate student progress from real data
export function calculateStudentProgress(
  courses: Course[],
  assignments: Assignment[],
  submissions: Submission[]
): StudentProgress[] {
  const progressList: StudentProgress[] = [];
  
  courses.forEach(course => {
    course.students.forEach(studentId => {
      const courseAssignments = assignments.filter(a => a.courseId === course.id);
      const studentSubmissions = submissions.filter(
        s => s.studentId === studentId && 
        courseAssignments.some(a => a.id === s.assignmentId)
      );
      
      const completedAssignments = studentSubmissions.filter(
        s => s.status === 'entregado' || s.status === 'evaluado'
      ).length;
      
      const gradedSubmissions = studentSubmissions.filter(s => s.grade !== undefined);
      const averageGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
        : 0;
      
      // Mock attendance rate for now (would need Google Calendar integration)
      const attendanceRate = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      progressList.push({
        studentId,
        courseId: course.id,
        assignmentsCompleted: completedAssignments,
        totalAssignments: courseAssignments.length,
        averageGrade,
        attendanceRate,
        lastActivity: new Date(),
      });
    });
  });
  
  return progressList;
}

// Generate notifications from real data
export function generateNotifications(
  assignments: Assignment[],
  submissions: Submission[],
  students: User[]
): Notification[] {
  const notifications: Notification[] = [];
  
  // Upcoming assignments
  const upcomingAssignments = assignments.filter(
    a => a.dueDate > new Date() && a.dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );
  
  upcomingAssignments.forEach(assignment => {
    students.forEach(student => {
      const hasSubmission = submissions.some(
        s => s.assignmentId === assignment.id && s.studentId === student.id
      );
      
      if (!hasSubmission) {
        notifications.push({
          id: `reminder-${assignment.id}-${student.id}`,
          userId: student.id,
          title: 'Recordatorio de entrega',
          message: `La tarea "${assignment.title}" vence pronto`,
          type: 'reminder',
          read: false,
          createdAt: new Date(),
        });
      }
    });
  });
  
  // New grades
  const recentGrades = submissions.filter(
    s => s.status === 'evaluado' && s.grade !== undefined
  );
  
  recentGrades.forEach(submission => {
    const assignment = assignments.find(a => a.id === submission.assignmentId);
    if (assignment) {
      notifications.push({
        id: `grade-${submission.id}`,
        userId: submission.studentId,
        title: 'Nueva calificación',
        message: `Tu tarea "${assignment.title}" ha sido calificada: ${submission.grade}/${assignment.maxPoints}`,
        type: 'grade',
        read: false,
        createdAt: new Date(),
      });
    }
  });
  
  return notifications;
}
