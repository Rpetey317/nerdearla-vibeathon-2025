import { NextRequest, NextResponse } from 'next/server';
import { getCourses, transformCourseToInternal } from '@/lib/google-classroom';

export async function GET(request: NextRequest) {
  try {
    const courses = await getCourses();
    const transformedCourses = courses.map(transformCourseToInternal);
    
    return NextResponse.json(transformedCourses);
  } catch (error: any) {
    console.error('Error fetching courses:', error);
    
    // Handle authentication errors specifically
    if (error.message?.includes('sign in') || error.message?.includes('token')) {
      return NextResponse.json(
        { 
          error: 'Authentication required', 
          message: error.message,
          requiresAuth: true 
        },
        { status: 401 }
      );
    }
    
    // Handle Google API errors
    if (error.code === 401 || error.status === 401) {
      return NextResponse.json(
        { 
          error: 'Invalid credentials', 
          message: 'Please sign out and sign in again to refresh your authentication.',
          requiresAuth: true 
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch courses',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
