import { NextRequest } from 'next/server';
import { getProjectBySlug, updateProjectBySlug, deleteProjectBySlug } from '@/lib/controllers/projectController';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return getProjectBySlug(slug);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return updateProjectBySlug(request, slug);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return deleteProjectBySlug(slug);
}