import { NextRequest } from 'next/server';
import { getAssessments, createAssessment } from '@/lib/controllers/assessmentController';

export async function GET(request: NextRequest) {
  return getAssessments(request);
}

export async function POST(request: NextRequest) {
  return createAssessment(request);
}