import { NextRequest } from 'next/server';
import { getProjects, createProject } from '@/lib/controllers/projectController';

export async function GET(request: NextRequest) {
  return getProjects(request);
}

export async function POST(request: NextRequest) {
  return createProject(request);
}