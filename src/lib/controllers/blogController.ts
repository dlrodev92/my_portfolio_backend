import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { Prisma } from '@prisma/client';
import {
  handleBlogFileUploads,
  processContentBlocks,
  manageBlogSeries,
  createBlogTags,
  createBlogCategory,
  calculateWordCount
} from '@/lib/utils/blogHelpers';
import { UploadedFiles, ContentBlockInput, CategoryData, SeriesData, TagData, AuthorData } from '@/lib/types/blogs';

export const createBlogPost = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const formData = await req.formData();

    const getText = (key: string) => formData.get(key)?.toString() ?? '';
    const parseJSON = <T>(key: string, fallback: T): T => {
      try {
        return JSON.parse(getText(key)) as T;
      } catch {
        return fallback;
      }
    };

    const title = getText('title');
    const subtitle = getText('subtitle');
    const excerpt = getText('excerpt');
    const metaDescription = getText('metaDescription');
    const heroImageAlt = getText('heroImageAlt');
    const heroImageCaption = getText('heroImageCaption');
    const readTime = getText('readTime');
    const publishedAt = getText('publishedAt');

    const files: UploadedFiles = {};

    const heroImage = formData.get('heroImage') as File;
    if (heroImage) {
      const buffer = Buffer.from(await heroImage.arrayBuffer());
      files.heroImage = [{
        buffer,
        originalname: heroImage.name,
        mimetype: heroImage.type,
        size: heroImage.size,
      }];
    }

    const socialImage = formData.get('socialImage') as File;
    if (socialImage) {
      const buffer = Buffer.from(await socialImage.arrayBuffer());
      files.socialImage = [{
        buffer,
        originalname: socialImage.name,
        mimetype: socialImage.type,
        size: socialImage.size,
      }];
    }

    const contentImages = formData.getAll('contentImages') as File[];
    if (contentImages.length > 0) {
      files.contentImages = [];
      for (const file of contentImages) {
        const buffer = Buffer.from(await file.arrayBuffer());
        files.contentImages.push({
          buffer,
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
        });
      }
    }

    const contentBlocks = parseJSON<ContentBlockInput[]>('contentBlocks', []);
    const category = parseJSON<CategoryData | null>('category', null);
    const series = parseJSON<SeriesData | null>('series', null);
    const tags = parseJSON<TagData[]>('tags', []);
    const author = parseJSON<AuthorData>('author', { name: 'David Lopez Rodriguez', bio: 'Full-stack developer' });

    const { heroImageUrl, socialImageUrl, processedContentBlocks } = await handleBlogFileUploads(files, contentBlocks);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const wordCount = calculateWordCount(processedContentBlocks);

    const blogPost = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const categoryRecord = await createBlogCategory(tx, category);

      const newBlogPost = await tx.blogPost.create({
        data: {
          title,
          subtitle,
          slug,
          excerpt,
          metaDescription,
          socialImage: socialImageUrl,
          readTime: parseInt(readTime) || 5,
          wordCount,
          heroImage: heroImageUrl,
          heroImageAlt,
          heroImageCaption,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
          author,
          categoryId: categoryRecord?.id || null,
        },
      });

      await processContentBlocks(tx, newBlogPost.id, processedContentBlocks);
      await manageBlogSeries(tx, newBlogPost.id, series);
      await createBlogTags(tx, newBlogPost.id, tags);

      return newBlogPost;
    });

    return NextResponse.json({ success: true, data: blogPost }, { status: 201 });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create blog post',
    }, { status: 500 });
  }
};
