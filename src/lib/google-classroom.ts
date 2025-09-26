import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Initialize Google Classroom API
const classroom = google.classroom('v1');

// Get authenticated classroom client
async function getClassroomClient() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('No active session found. Please sign in.');
  }

  if (session.error === 'RefreshAccessTokenError') {
    throw new Error('Authentication token has expired. Please sign in again.');
  }
  
  if (!session.accessToken) {
    throw new Error('No valid access token found. Please sign in again.');
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  
  auth.setCredentials({
    access_token: session.accessToken as string,
    refresh_token: session.refreshToken as string,
  });

  return google.classroom({ version: 'v1', auth });
}

// API Functions
export async function getCourses() {
  try {
    const classroomClient = await getClassroomClient();
    const response = await classroomClient.courses.list({
      courseStates: ['ACTIVE'],
      pageSize: 50,
    });

    return response.data.courses || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

export async function getCourseStudents(courseId: string) {
  try {
    const classroomClient = await getClassroomClient();
    const response = await classroomClient.courses.students.list({
      courseId,
      pageSize: 100,
    });

    return response.data.students || [];
  } catch (error) {
    console.error('Error fetching course students:', error);
    throw error;
  }
}

export async function getCourseTeachers(courseId: string) {
  try {
    const classroomClient = await getClassroomClient();
    const response = await classroomClient.courses.teachers.list({
      courseId,
      pageSize: 100,
    });

    return response.data.teachers || [];
  } catch (error) {
    console.error('Error fetching course teachers:', error);
    throw error;
  }
}

export async function getCourseWork(courseId: string) {
  try {
    const classroomClient = await getClassroomClient();
    const response = await classroomClient.courses.courseWork.list({
      courseId,
      pageSize: 100,
      orderBy: 'dueDate desc',
    });

    return response.data.courseWork || [];
  } catch (error: any) {
    console.error('Error fetching course work:', error);
    
    // Provide more specific error information
    if (error.status === 403 || error.code === 403) {
      throw new Error(`Permission denied: Unable to access course work for course ${courseId}. You may need teacher permissions for this course.`);
    }
    
    if (error.status === 401 || error.code === 401) {
      throw new Error('Authentication failed. Please sign in again.');
    }
    
    throw error;
  }
}

export async function getStudentSubmissions(courseId: string, courseWorkId: string) {
  try {
    const classroomClient = await getClassroomClient();
    const response = await classroomClient.courses.courseWork.studentSubmissions.list({
      courseId,
      courseWorkId,
      pageSize: 100,
    });

    return response.data.studentSubmissions || [];
  } catch (error: any) {
    console.error('Error fetching student submissions:', error);
    
    // Provide more specific error information
    if (error.status === 403 || error.code === 403) {
      throw new Error(`Permission denied: Unable to access student submissions for course ${courseId}. You may need teacher permissions for this course.`);
    }
    
    if (error.status === 401 || error.code === 401) {
      throw new Error('Authentication failed. Please sign in again.');
    }
    
    throw error;
  }
}

export async function getAllStudentSubmissions(courseId: string) {
  try {
    const courseWork = await getCourseWork(courseId);
    const allSubmissions = [];

    for (const work of courseWork) {
      if (work.id) {
        const submissions = await getStudentSubmissions(courseId, work.id);
        allSubmissions.push(...submissions.map(sub => ({
          ...sub,
          courseWorkId: work.id,
          courseWorkTitle: work.title,
          maxPoints: work.maxPoints,
          dueDate: work.dueDate,
        })));
      }
    }

    return allSubmissions;
  } catch (error) {
    console.error('Error fetching all student submissions:', error);
    throw error;
  }
}

export async function getUserProfile() {
  try {
    const classroomClient = await getClassroomClient();
    const response = await classroomClient.userProfiles.get({
      userId: 'me',
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Helper function to determine user role in a course
export async function getUserRoleInCourse(courseId: string, userId: string) {
  try {
    const classroomClient = await getClassroomClient();
    
    // Check if user is a teacher
    try {
      await classroomClient.courses.teachers.get({
        courseId,
        userId,
      });
      return 'teacher';
    } catch {
      // Not a teacher, check if student
      try {
        await classroomClient.courses.students.get({
          courseId,
          userId,
        });
        return 'student';
      } catch {
        return 'none';
      }
    }
  } catch (error) {
    console.error('Error determining user role:', error);
    return 'none';
  }
}

// Transform Google Classroom data to our internal format
export function transformCourseToInternal(course: any) {
  // Helper function to safely create date from timestamp
  const safeCreateDate = (timestamp: string): Date => {
    if (!timestamp) return new Date();
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp for course:', timestamp);
        return new Date();
      }
      return date;
    } catch (error) {
      console.warn('Error creating date from timestamp:', timestamp, error);
      return new Date();
    }
  };

  return {
    id: course.id,
    name: course.name,
    description: course.description || '',
    teacherId: course.ownerId,
    students: [], // Will be populated separately
    createdAt: safeCreateDate(course.creationTime),
    updatedAt: safeCreateDate(course.updateTime),
    alternateLink: course.alternateLink,
    courseState: course.courseState,
  };
}

export function transformCourseWorkToAssignment(courseWork: any, courseId: string) {
  // Helper function to safely create date from Google Classroom date object
  const createDateFromGoogleDate = (googleDate: any): Date => {
    if (!googleDate) return new Date();
    
    try {
      // Google Classroom returns dates in format: { year: 2024, month: 1, day: 15 }
      // Note: month is 1-based in Google's format, but Date constructor expects 0-based
      const year = googleDate.year || new Date().getFullYear();
      const month = (googleDate.month || 1) - 1; // Convert to 0-based
      const day = googleDate.day || 1;
      
      const date = new Date(year, month, day);
      
      // Validate the created date
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from Google date object:', googleDate);
        return new Date();
      }
      
      return date;
    } catch (error) {
      console.warn('Error creating date from Google date object:', googleDate, error);
      return new Date();
    }
  };

  // Helper function to safely create date from timestamp string
  const createDateFromTimestamp = (timestamp: string): Date => {
    if (!timestamp) return new Date();
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp:', timestamp);
        return new Date();
      }
      return date;
    } catch (error) {
      console.warn('Error creating date from timestamp:', timestamp, error);
      return new Date();
    }
  };

  return {
    id: courseWork.id,
    courseId,
    title: courseWork.title,
    description: courseWork.description || '',
    dueDate: createDateFromGoogleDate(courseWork.dueDate),
    maxPoints: courseWork.maxPoints || 100,
    createdAt: createDateFromTimestamp(courseWork.creationTime),
    alternateLink: courseWork.alternateLink,
    workType: courseWork.workType,
  };
}

export function transformSubmissionToInternal(submission: any) {
  const getSubmissionState = (state: string) => {
    switch (state) {
      case 'TURNED_IN': return 'submitted';
      case 'RETURNED': return 'graded';
      case 'RECLAIMED_BY_STUDENT': return 'pending';
      default: return 'pending';
    }
  };

  // Helper function to safely create date from timestamp
  const safeCreateDate = (timestamp: string): Date | undefined => {
    if (!timestamp) return undefined;
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp for submission:', timestamp);
        return undefined;
      }
      return date;
    } catch (error) {
      console.warn('Error creating date from timestamp:', timestamp, error);
      return undefined;
    }
  };

  return {
    id: submission.id,
    assignmentId: submission.courseWorkId,
    studentId: submission.userId,
    submittedAt: safeCreateDate(submission.updateTime),
    grade: submission.assignedGrade,
    status: getSubmissionState(submission.state),
    feedback: submission.draftGrade ? 'Graded' : undefined,
    late: submission.late || false,
  };
}
