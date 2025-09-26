import { NextRequest, NextResponse } from 'next/server';
import { getCourses, transformCourseToInternal } from '@/lib/google-classroom';

export async function GET(request: NextRequest) {
  try {
    const courses = await getCourses();
    const transformedCourses = courses.map(transformCourseToInternal);
    
    return NextResponse.json(transformedCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
