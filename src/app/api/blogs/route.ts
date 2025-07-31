import { NextRequest } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/lib/controllers/blogController';

export async function GET(request: NextRequest) {
  return getBlogPosts(request);
}

export async function POST(request: NextRequest) {
  return createBlogPost(request);
}
