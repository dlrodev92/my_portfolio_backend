import { NextRequest } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/controllers/projectController';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  return getProjectById(id);
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  return updateProject(id, request);
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;
  return deleteProject(id);
}