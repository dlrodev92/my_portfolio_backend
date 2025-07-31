import { NextRequest } from 'next/server';
import { getBlogPostsForCards } from '@/lib/controllers/blogController';

export async function GET(request: NextRequest) {
  return getBlogPostsForCards(request);
}
