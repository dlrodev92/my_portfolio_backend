import { NextRequest } from 'next/server';
import { getProjectsForCards } from '@/lib/controllers/projectController';

export async function GET(request: NextRequest) {
  return getProjectsForCards(request);
}
