import { NextRequest, NextResponse } from 'next/server';
import { getAllStudentSubmissions, transformSubmissionToInternal } from '@/lib/google-classroom';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const submissions = await getAllStudentSubmissions(params.courseId);
    const transformedSubmissions = submissions.map(transformSubmissionToInternal);
    
    return NextResponse.json(transformedSubmissions);
  } catch (error: any) {
    console.error('Error fetching submissions:', error);
    
    // Handle specific Google API errors
    if (error.status === 403 || error.code === 403) {
      return NextResponse.json(
        { 
          error: 'Insufficient permissions to access student submissions. Please ensure you have teacher or appropriate access to this course.',
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
      { error: 'Failed to fetch submissions', details: error.message },
      { status: 500 }
    );
  }
}
