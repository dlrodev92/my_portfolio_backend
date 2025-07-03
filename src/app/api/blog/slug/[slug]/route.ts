import { getBlogPostBySlug } from '@/lib/controllers/blogController';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  return getBlogPostBySlug(params.slug);
}
