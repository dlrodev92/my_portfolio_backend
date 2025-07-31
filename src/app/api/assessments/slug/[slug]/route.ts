import { NextRequest } from 'next/server';
import { getAssessmentBySlug, updateAssessmentBySlug, deleteAssessmentBySlug } from '@/lib/controllers/assessmentController';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const response = await getAssessmentBySlug(slug);
  return response;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return updateAssessmentBySlug(request, slug);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return deleteAssessmentBySlug(slug);
}

