import { NextRequest } from 'next/server';
import { getBlogPostById, updateBlogPost, deleteBlogPost } from '@/lib/controllers/blogController';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return getBlogPostById(params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return updateBlogPost(params.id, request);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return deleteBlogPost(params.id);
}
