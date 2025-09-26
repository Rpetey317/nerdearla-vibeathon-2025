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
  } catch (error) {
    console.error('Error fetching course work:', error);
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
  } catch (error) {
    console.error('Error fetching student submissions:', error);
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
  return {
    id: course.id,
    name: course.name,
    description: course.description || '',
    teacherId: course.ownerId,
    students: [], // Will be populated separately
    createdAt: new Date(course.creationTime),
    updatedAt: new Date(course.updateTime),
    alternateLink: course.alternateLink,
    courseState: course.courseState,
  };
}

export function transformCourseWorkToAssignment(courseWork: any, courseId: string) {
  return {
    id: courseWork.id,
    courseId,
    title: courseWork.title,
    description: courseWork.description || '',
    dueDate: courseWork.dueDate ? new Date(
      courseWork.dueDate.year,
      courseWork.dueDate.month - 1,
      courseWork.dueDate.day
    ) : new Date(),
    maxPoints: courseWork.maxPoints || 100,
    createdAt: new Date(courseWork.creationTime),
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

  return {
    id: submission.id,
    assignmentId: submission.courseWorkId,
    studentId: submission.userId,
    submittedAt: submission.updateTime ? new Date(submission.updateTime) : undefined,
    grade: submission.assignedGrade,
    status: getSubmissionState(submission.state),
    feedback: submission.draftGrade ? 'Graded' : undefined,
    late: submission.late || false,
  };
}
