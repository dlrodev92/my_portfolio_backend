import { NextRequest } from 'next/server';
import { getBlogPostBySlug, updateBlogPostBySlug, deleteBlogPostBySlug } from '@/lib/controllers/blogController';

export async function GET(
  request: NextRequest,
   { params }: { params: Promise<{ slug: string }> }
) {
   const { slug } = await params;
  return getBlogPostBySlug(slug);
}

export async function PUT(
  request: NextRequest,
   { params }: { params: Promise<{ slug: string }> }
) {
   const { slug } = await params;
  return updateBlogPostBySlug(request, slug);
}

export async function DELETE(
  request: NextRequest,
   { params }: { params: Promise<{ slug: string }> }
) {
   const { slug } = await params;
  return deleteBlogPostBySlug(slug);
}