import BlogCreateForm from "@/components/dashboard/blog/blogCreateForm";
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
      }).then(series => series.map(s => ({
        ...s,
        description: s.description ?? undefined
      })))
    ]);

    return { categories, series };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return { categories: [], series: [] };
  }
}

export default async function CreateBlogPage() {
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
          <h1 className="text-3xl font-title font-bold">Create New Blog Post</h1>
          <p className="text-muted-foreground">
            Write and publish your next blog post
          </p>
        </div>
      </div>

      {/* Form */}
      <BlogCreateForm categories={categories} series={series} />
    </div>
  );
}