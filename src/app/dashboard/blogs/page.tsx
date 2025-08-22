import { prisma } from '@/lib/prisma/client';
import BlogsHeader from '@/components/dashboard/blog/blogsHeader';
import BlogsContainer from '@/components/dashboard/blog/blogsContainer';
import { BlogPostWithRelations } from '@/lib/types/blogs';

async function getBlogsData() {
  try {
    const rawBlogs = await prisma.blogPost.findMany({
      include: {
        category: true,
        series: true,
        contentBlocks: {
          orderBy: { order: 'asc' }
        },
        blogPostTags: {
          include: {
            blogTag: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fix author type to match BlogPostWithRelations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blogs: BlogPostWithRelations[] = rawBlogs.map((blog: any) => ({
      ...blog,
      author: typeof blog.author === 'string'
        ? JSON.parse(blog.author)
        : blog.author,
    }));

    // Rest of your code stays the same...
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const stats = {
      total: blogs.length,
      published: blogs.filter(b => b.publishedAt && b.publishedAt <= now).length,
      draft: blogs.filter(b => !b.publishedAt || b.publishedAt > now).length,
      thisMonth: blogs.filter(b => b.createdAt >= startOfMonth).length,
      totalViews: blogs.reduce((sum, blog) => sum + blog.views, 0),
      avgReadTime: blogs.length > 0 ? Math.round(blogs.reduce((sum, blog) => sum + blog.readTime, 0) / blogs.length) : 0,
    };

    // Extraer categorías únicas
    const categoriesSet = new Set<string>();
    const availableCategories = blogs
      .filter(blog => blog.category)
      .map(blog => blog.category!)
      .filter(category => {
        if (categoriesSet.has(category.name)) {
          return false;
        }
        categoriesSet.add(category.name);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // Extraer tags únicos
    const tagsSet = new Set<string>();
    const availableTags = blogs
      .flatMap(blog => blog.blogPostTags.map(pt => pt.blogTag))
      .filter(tag => {
        if (tagsSet.has(tag.name)) {
          return false;
        }
        tagsSet.add(tag.name);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // Extraer series únicas
    const seriesSet = new Set<string>();
    const availableSeries = blogs
      .filter(blog => blog.series)
      .map(blog => blog.series!)
      .filter(series => {
        if (seriesSet.has(series.name)) {
          return false;
        }
        seriesSet.add(series.name);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      blogs,
      stats,
      availableCategories,
      availableTags,
      availableSeries
    };
  } catch (error) {
    console.error('Error fetching blogs data:', error);
    return {
      blogs: [],
      stats: {
        total: 0,
        published: 0,
        draft: 0,
        thisMonth: 0,
        totalViews: 0,
        avgReadTime: 0,
      },
      availableCategories: [],
      availableTags: [],
      availableSeries: []
    };
  }
}

export default async function BlogsPage() {
  const { blogs, stats, availableCategories, availableTags, availableSeries } = await getBlogsData();

  return (
    <div className="space-y-6 max-w-6xl">
      <BlogsHeader stats={stats} />
      
      <BlogsContainer 
        blogs={blogs}
        availableCategories={availableCategories}
        availableTags={availableTags}
        availableSeries={availableSeries}
      />
    </div>
  );
}