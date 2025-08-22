import BlogEditForm from "@/components/dashboard/blog/blogEditForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from '@/lib/prisma/client';

async function getBlogData() {
  try {
    const [categories, series] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.series.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    return { categories, series };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return { categories: [], series: [] };
  }
}

// Update the interface to reflect that params is a Promise
interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  // Await the params Promise
  const { slug } = await params;
  const { categories, series } = await getBlogData();

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/blogs">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-title font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground">
            Modify blog post details and content
          </p>
        </div>
      </div>

      <BlogEditForm
        slug={slug}
        categories={categories}
        series={series}
      />
    </div>
  );
}