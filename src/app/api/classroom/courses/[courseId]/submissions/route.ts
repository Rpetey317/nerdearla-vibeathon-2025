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
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
