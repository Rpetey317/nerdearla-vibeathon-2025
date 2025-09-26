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
  } catch (error) {
    console.error('Error fetching course work:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course work' },
      { status: 500 }
    );
  }
}
