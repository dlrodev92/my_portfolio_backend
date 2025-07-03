import { NextRequest } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/controllers/projectController';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return getProjectById(params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateProject(params.id, request);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return deleteProject(params.id);
}
