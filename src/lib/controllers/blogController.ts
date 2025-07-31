import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { Prisma, ContentBlockType, CalloutVariant, ListStyle, VideoType } from '@prisma/client';
import { ContentBlockData } from '@/lib/schemas/blog';
import { uploadFileToS3 } from '@/lib/utils/s3Upload';

interface CreateBlogData {
  title: string;
  subtitle?: string;
  excerpt: string;
  metaDescription: string;
  readTime: number;
  wordCount: number;
  publishedAt?: string;
  categoryId?: string;
  seriesId?: string;
  seriesPart?: number;
  heroImageAlt?: string;
  heroImageCaption?: string;
  contentBlocks: ContentBlockData[];
  tags: string[];
  author: {
    name: string;
    bio?: string;
    avatar?: string;
    social?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
      website?: string;
    };
  };
  slug?: string;
  newCategoryName?: string;
  newSeriesData?: {
    name: string;
    description?: string;
    totalParts: number;
  };
}

// Helper functions for creating new categories and series
const createNewCategory = async (tx: Prisma.TransactionClient, categoryName: string) => {
  const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return await tx.category.create({
    data: {
      name: categoryName,
      slug,
    },
  });
};

const createNewSeries = async (tx: Prisma.TransactionClient, seriesData: {
  name: string;
  description?: string;
  totalParts: number;
}) => {
  const slug = seriesData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return await tx.series.create({
    data: {
      name: seriesData.name,
      slug,
      description: seriesData.description,
      totalParts: seriesData.totalParts,
    },
  });
};

export const createBlogPost = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const formData = await req.formData();

    const getText = (key: string): string => formData.get(key)?.toString() ?? '';
    const getNumber = (key: string): number => parseInt(getText(key)) || 0;
    const getJSON = <T>(key: string, defaultValue: T): T => {
      try {
        const value = getText(key);
        return value ? JSON.parse(value) as T : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    // Parse all form data to match Zod schema fields
    const blogData: CreateBlogData = {
      title: getText('title'),
      subtitle: getText('subtitle') || undefined,
      excerpt: getText('excerpt'),
      metaDescription: getText('metaDescription'),
      readTime: getNumber('readTime'),
      wordCount: getNumber('wordCount'),
      publishedAt: getText('publishedAt') || undefined,
      categoryId: getText('categoryId') || undefined,
      seriesId: getText('seriesId') || undefined,
      seriesPart: getNumber('seriesPart') || undefined,
      heroImageAlt: getText('heroImageAlt') || undefined,
      heroImageCaption: getText('heroImageCaption') || undefined,
      contentBlocks: getJSON<ContentBlockData[]>('contentBlocks', []),
      tags: getJSON<string[]>('tags', []),
      author: getJSON<CreateBlogData['author']>('author', { name: 'Anonymous' }),
      slug: getText('slug') || undefined,
      newCategoryName: getText('newCategoryName') || undefined,
      newSeriesData: getJSON<CreateBlogData['newSeriesData']>('newSeriesData', undefined),
    };

    // Handle files with proper typing (heroImage and socialImage from Zod schema)
    const heroImage = formData.get('heroImage') as File | null;
    const socialImage = formData.get('socialImage') as File | null;

    // Generate slug - use custom slug or generate from title
    const slug = blogData.slug || blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug is unique
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (existingPost) {
      return NextResponse.json({
        error: 'Slug already exists. Please choose a different slug.',
      }, { status: 400 });
    }

    // Handle file uploads to S3
    let heroImageUrl: string | null = null;
    let socialImageUrl: string | null = null;

    if (heroImage && heroImage.size > 0) {
      const heroImageBuffer = Buffer.from(await heroImage.arrayBuffer());
      const heroUploadResult = await uploadFileToS3({
        buffer: heroImageBuffer,
        originalname: heroImage.name,
        mimetype: heroImage.type,
        size: heroImage.size
      }, 'blog');
      
      if (heroUploadResult.success) {
        heroImageUrl = heroUploadResult.url!;
      } else {
        return NextResponse.json({
          error: `Hero image upload failed: ${heroUploadResult.error}`,
        }, { status: 500 });
      }
    }

    if (socialImage && socialImage.size > 0) {
      const socialImageBuffer = Buffer.from(await socialImage.arrayBuffer());
      const socialUploadResult = await uploadFileToS3({
        buffer: socialImageBuffer,
        originalname: socialImage.name,
        mimetype: socialImage.type,
        size: socialImage.size
      }, 'blog');
      
      if (socialUploadResult.success) {
        socialImageUrl = socialUploadResult.url!;
      } else {
        return NextResponse.json({
          error: `Social image upload failed: ${socialUploadResult.error}`,
        }, { status: 500 });
      }
    }

    const blogPost = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let finalCategoryId = blogData.categoryId;
      let finalSeriesId = blogData.seriesId;

      // Create new category if specified
      if (blogData.newCategoryName) {
        const newCategory = await createNewCategory(tx, blogData.newCategoryName);
        finalCategoryId = newCategory.id.toString();
      }

      // Create new series if specified
      if (blogData.newSeriesData) {
        const newSeries = await createNewSeries(tx, blogData.newSeriesData);
        finalSeriesId = newSeries.id.toString();
      }

      // Create the blog post
      const newBlogPost = await tx.blogPost.create({
        data: {
          title: blogData.title,
          subtitle: blogData.subtitle,
          slug,
          excerpt: blogData.excerpt,
          metaDescription: blogData.metaDescription,
          socialImage: socialImageUrl,
          readTime: blogData.readTime,
          wordCount: blogData.wordCount,
          views: 0,
          heroImage: heroImageUrl,
          heroImageAlt: blogData.heroImageAlt,
          heroImageCaption: blogData.heroImageCaption,
          publishedAt: blogData.publishedAt ? new Date(blogData.publishedAt) : null,
          author: blogData.author as Prisma.InputJsonValue,
          categoryId: finalCategoryId && finalCategoryId !== 'none' ? parseInt(finalCategoryId) : null,
          seriesId: finalSeriesId && finalSeriesId !== 'none' ? parseInt(finalSeriesId) : null,
          seriesPart: blogData.seriesPart,
        },
      });

      // Create content blocks with proper typing
      if (blogData.contentBlocks.length > 0) {
        const contentBlocksData: Prisma.ContentBlockCreateManyInput[] = blogData.contentBlocks.map((block, index) => {
          // Helper function to handle JSON values properly
          const getJsonValue = (value: unknown): Prisma.InputJsonValue | undefined => {
            if (value === null || value === undefined) {
              return undefined;
            }
            return value as Prisma.InputJsonValue;
          };

          return {
            blogPostId: newBlogPost.id,
            type: block.type as ContentBlockType,
            order: block.order ?? index,
            content: block.content,
            level: block.level ?? undefined,
            language: block.language ?? undefined,
            codeTitle: block.codeTitle ?? undefined,
            imageUrl: block.imageUrl ?? undefined,
            imageAlt: block.imageAlt ?? undefined,
            imageCaption: block.imageCaption ?? undefined,
            imageAlignment: block.imageAlignment ?? undefined,
            calloutVariant: block.calloutVariant as CalloutVariant | undefined ?? undefined,
            calloutTitle: block.calloutTitle ?? undefined,
            quoteAuthor: block.quoteAuthor ?? undefined,
            listStyle: block.listStyle as ListStyle | undefined ?? undefined,
            listItems: getJsonValue(block.listItems),
            videoType: block.videoType as VideoType | undefined ?? undefined,
            videoId: block.videoId ?? undefined,
            videoTitle: block.videoTitle ?? undefined,
            paragraphStyle: block.paragraphStyle ?? undefined,
          };
        });

        await tx.contentBlock.createMany({
          data: contentBlocksData,
        });
      }

      // Create blog tags
      if (blogData.tags.length > 0) {
        for (const tagName of blogData.tags) {
          // Find or create tag
          const tag = await tx.blogTag.upsert({
            where: { name: tagName },
            update: {},
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            },
          });

          // Create blog post tag relationship
          await tx.blogPostTag.create({
            data: {
              blogPostId: newBlogPost.id,
              blogTagId: tag.id,
            },
          });
        }
      }

      return newBlogPost;
    });

    return NextResponse.json({ 
      success: true, 
      data: blogPost 
    }, { status: 201 });

  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create blog post',
    }, { status: 500 });
  }
};

interface BlogPostsFilter {
  published?: string;
  categoryId?: string;
  seriesId?: string;
  search?: string;
}

// Get all categories
export const getCategories = async (): Promise<NextResponse> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            blogPosts: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: categories 
    }, { status: 200 });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch categories',
    }, { status: 500 });
  }
};

// Get all series
export const getSeries = async (): Promise<NextResponse> => {
  try {
    const series = await prisma.series.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: {
            blogPosts: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: series 
    }, { status: 200 });

  } catch (error) {
    console.error('Get series error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch series',
    }, { status: 500 });
  }
};

export const getBlogPosts = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse filters with proper typing
    const filters: BlogPostsFilter = {
      published: searchParams.get('published') ?? undefined,
      categoryId: searchParams.get('categoryId') ?? undefined,
      seriesId: searchParams.get('seriesId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    };
    
    // Build where clause with proper typing
    const whereClause: Prisma.BlogPostWhereInput = {};
    
    if (filters.published === 'true') {
      whereClause.publishedAt = {
        not: null,
        lte: new Date()
      };
    } else if (filters.published === 'false') {
      whereClause.publishedAt = null;
    }
    
    if (filters.categoryId) {
      whereClause.categoryId = parseInt(filters.categoryId);
    }
    
    if (filters.seriesId) {
      whereClause.seriesId = parseInt(filters.seriesId);
    }
    
    if (filters.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    const blogPosts = await prisma.blogPost.findMany({
      where: whereClause,
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

    return NextResponse.json({ 
      success: true, 
      data: blogPosts,
      count: blogPosts.length 
    }, { status: 200 });

  } catch (error) {
    console.error('Get blog posts error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
    }, { status: 500 });
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<NextResponse> => {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { slug },
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
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost);

  } catch (error) {
    console.error('Get blog post by slug error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
};

export const updateBlogPostBySlug = async (req: NextRequest, slug: string): Promise<NextResponse> => {
  try {
    // Check if blog post exists
    const existingBlogPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!existingBlogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const getText = (key: string) => formData.get(key)?.toString() ?? '';
    const getJson = (key: string) => {
      const value = formData.get(key)?.toString();
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    };

    const title = getText('title');
    const subtitle = getText('subtitle') || null;
    const excerpt = getText('excerpt');
    const metaDescription = getText('metaDescription');
    const categoryId = getText('categoryId') ? parseInt(getText('categoryId')) : null;
    const seriesId = getText('seriesId') ? parseInt(getText('seriesId')) : null;
    const seriesPart = getText('seriesPart') ? parseInt(getText('seriesPart')) : null;
    const heroImageAlt = getText('heroImageAlt') || null;
    const heroImageCaption = getText('heroImageCaption') || null;
    const readTime = parseInt(getText('readTime')) || 5;
    const wordCount = parseInt(getText('wordCount')) || 1000;
    const publishedAt = getText('publishedAt');
    
    const author = getJson('author');
    const contentBlocks = getJson('contentBlocks') || [];
    const tags = getJson('tags') || [];

    const heroImage = formData.get('heroImage') as File;
    const socialImage = formData.get('socialImage') as File;

    // Generate new slug from title if title changed
    let newSlug = slug; // Keep existing slug by default
    if (title && title !== existingBlogPost.title) {
      newSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if new slug already exists (and it's not the current blog post)
      const existingSlugBlogPost = await prisma.blogPost.findUnique({
        where: { slug: newSlug },
      });
      
      if (existingSlugBlogPost && existingSlugBlogPost.slug !== slug) {
        // Add timestamp to make it unique
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }

    // Handle file uploads to S3
    let heroImageUrl = existingBlogPost.heroImage;
    let socialImageUrl = existingBlogPost.socialImage;

    if (heroImage && heroImage.size > 0) {
      const heroImageBuffer = Buffer.from(await heroImage.arrayBuffer());
      const heroUploadResult = await uploadFileToS3({
        buffer: heroImageBuffer,
        originalname: heroImage.name,
        mimetype: heroImage.type,
        size: heroImage.size
      }, 'blog');
      
      if (heroUploadResult.success) {
        heroImageUrl = heroUploadResult.url!;
      } else {
        return NextResponse.json({
          error: `Hero image upload failed: ${heroUploadResult.error}`,
        }, { status: 500 });
      }
    }

    if (socialImage && socialImage.size > 0) {
      const socialImageBuffer = Buffer.from(await socialImage.arrayBuffer());
      const socialUploadResult = await uploadFileToS3({
        buffer: socialImageBuffer,
        originalname: socialImage.name,
        mimetype: socialImage.type,
        size: socialImage.size
      }, 'blog');
      
      if (socialUploadResult.success) {
        socialImageUrl = socialUploadResult.url!;
      } else {
        return NextResponse.json({
          error: `Social image upload failed: ${socialUploadResult.error}`,
        }, { status: 500 });
      }
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update main blog post data
      const updatedBlogPost = await tx.blogPost.update({
        where: { slug },
        data: {
          title,
          subtitle,
          slug: newSlug,
          excerpt,
          metaDescription,
          heroImage: heroImageUrl,
          socialImage: socialImageUrl,
          heroImageAlt,
          heroImageCaption,
          readTime,
          wordCount,
          author: author || Prisma.JsonNull,
          categoryId,
          seriesId,
          seriesPart,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      const blogPostId = updatedBlogPost.id;

      // Delete existing content blocks and recreate
      await tx.contentBlock.deleteMany({ where: { blogPostId } });
      
      if (contentBlocks.length > 0) {
        await tx.contentBlock.createMany({
          data: contentBlocks.map((block: ContentBlockData, index: number) => ({
            blogPostId,
            type: block.type,
            order: block.order || index,
            content: block.content,
            level: block.level || null,
            language: block.language || null,
            codeTitle: block.codeTitle || null,
            imageUrl: block.imageUrl || null,
            imageAlt: block.imageAlt || null,
            imageCaption: block.imageCaption || null,
            imageAlignment: block.imageAlignment || null,
            calloutVariant: block.calloutVariant || null,
            calloutTitle: block.calloutTitle || null,
            quoteAuthor: block.quoteAuthor || null,
            listStyle: block.listStyle || null,
            listItems: block.listItems ? JSON.stringify(block.listItems) : null,
            videoType: block.videoType || null,
            videoId: block.videoId || null,
            videoTitle: block.videoTitle || null,
            paragraphStyle: block.paragraphStyle || null,
          }))
        });
      }

      // Handle tags
      await tx.blogPostTag.deleteMany({ where: { blogPostId } });
      
      if (tags.length > 0) {
        for (const tagName of tags) {
          // Find or create tag
          const tag = await tx.blogTag.upsert({
            where: { name: tagName },
            update: {},
            create: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            },
          });

          // Create blog post tag relationship
          await tx.blogPostTag.create({
            data: {
              blogPostId,
              blogTagId: tag.id,
            },
          });
        }
      }

      return updatedBlogPost;
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      blogPost: result,
      newSlug: newSlug, // Return new slug in case it changed
    });

  } catch (error) {
    console.error('Update blog post error:', error);
    
    // Handle unique constraint errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A blog post with this title already exists' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
};

export const deleteBlogPostBySlug = async (slug: string): Promise<NextResponse> => {
  try {
    // Check if blog post exists
    const existingBlogPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!existingBlogPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Delete blog post (cascade will handle related data)
    await prisma.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });

  } catch (error) {
    console.error('Delete blog post error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
};