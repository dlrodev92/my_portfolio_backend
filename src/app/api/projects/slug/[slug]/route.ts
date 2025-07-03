import { getProjectBySlug } from '@/lib/controllers/projectController';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  return getProjectBySlug(params.slug);
}
