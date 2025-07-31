import { NextRequest } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/controllers/projectController';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  return getProjectById(id);
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  return updateProject(id, request);
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  return deleteProject(id);
}