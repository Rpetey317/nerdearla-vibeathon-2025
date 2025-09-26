import { NextRequest, NextResponse } from 'next/server';
import { getCourseStudents } from '@/lib/google-classroom';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const students = await getCourseStudents(params.courseId);
    
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching course students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course students' },
      { status: 500 }
    );
  }
}
