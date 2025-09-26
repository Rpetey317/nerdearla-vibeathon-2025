import { NextRequest, NextResponse } from 'next/server';
import { getCourseWork, transformCourseWorkToAssignment } from '@/lib/google-classroom';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseWork = await getCourseWork(params.courseId);
    const transformedAssignments = courseWork.map(work => 
      transformCourseWorkToAssignment(work, params.courseId)
    );
    
    return NextResponse.json(transformedAssignments);
  } catch (error: any) {
    console.error('Error fetching course work:', error);
    
    // Handle specific Google API errors
    if (error.status === 403 || error.code === 403) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions to access course work. Please ensure you have teacher or appropriate access to this course.',
          code: 'PERMISSION_DENIED'
        },
        { status: 403 }
      );
    }
    
    if (error.status === 401 || error.code === 401) {
      return NextResponse.json(
        { 
          error: 'Authentication required. Please sign in again.',
          code: 'AUTHENTICATION_REQUIRED'
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch course work', details: error.message },
      { status: 500 }
    );
  }
}
