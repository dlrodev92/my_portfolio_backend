import { Prisma } from '@prisma/client';
import { uploadFileToS3, uploadMultipleFilesToS3 } from './s3Upload';
import { ContentBlockInput, SeriesData, TagData, CategoryData, UploadedFiles  } from '@/lib/types/blogs';

export const handleBlogFileUploads = async (
  files: UploadedFiles,
  contentBlocks: ContentBlockInput[]
): Promise<{
  heroImageUrl: string;
  socialImageUrl: string;
  processedContentBlocks: ContentBlockInput[];
}> => {
  let heroImageUrl = '';
  let socialImageUrl = '';
  let processedContentBlocks = [...contentBlocks];

  if (files.heroImage?.[0]) {
    const heroResult = await uploadFileToS3(files.heroImage[0], 'blog');
    if (!heroResult.success) throw new Error(`Hero image upload failed: ${heroResult.error}`);
    heroImageUrl = heroResult.url!;
  }

  if (files.socialImage?.[0]) {
    const socialResult = await uploadFileToS3(files.socialImage[0], 'blog');
    if (!socialResult.success) throw new Error(`Social image upload failed: ${socialResult.error}`);
    socialImageUrl = socialResult.url!;
  }

  if (files.contentImages?.length) {
    const contentImageResults = await uploadMultipleFilesToS3(files.contentImages, 'blog');
    let imageIndex = 0;
    processedContentBlocks = contentBlocks.map(block => {
      if (block.type === 'IMAGE' && imageIndex < contentImageResults.length) {
        const uploadResult = contentImageResults[imageIndex++];
        if (!uploadResult.success) throw new Error(`Content image upload failed: ${uploadResult.error}`);
        return { ...block, imageUrl: uploadResult.url };
      }
      return block;
    });
  }

  return { heroImageUrl, socialImageUrl, processedContentBlocks };
};

export const processContentBlocks = async (
  tx: Prisma.TransactionClient,
  blogPostId: number,
  contentBlocks: ContentBlockInput[]
): Promise<void> => {
  for (const block of contentBlocks) {
    const blockData = {
      blogPost: { connect: { id: blogPostId } },
      type: block.type,
      order: block.order ?? 0,
      content: block.content ?? '',
      level: block.level,
      language: block.language,
      codeTitle: block.codeTitle,
      imageUrl: block.imageUrl,
      imageAlt: block.imageAlt,
      imageCaption: block.imageCaption,
      imageAlignment: block.imageAlignment,
      calloutVariant: block.calloutVariant,
      calloutTitle: block.calloutTitle,
      quoteAuthor: block.quoteAuthor,
      listStyle: block.listStyle,
      listItems: block.listItems !== undefined ? block.listItems : Prisma.DbNull,
      videoType: block.videoType,
      videoId: block.videoId,
      videoTitle: block.videoTitle,
      paragraphStyle: block.paragraphStyle,
    };
    await tx.contentBlock.create({ data: blockData });
  }
};

export const manageBlogSeries = async (
  tx: Prisma.TransactionClient,
  blogPostId: number,
  seriesData: SeriesData | null
): Promise<void> => {
  if (!seriesData?.name) return;

  const series = await tx.series.upsert({
    where: { name: seriesData.name },
    update: {},
    create: {
      name: seriesData.name,
      slug: seriesData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: seriesData.description || null,
    },
  });

  await tx.blogPost.update({
    where: { id: blogPostId },
    data: {
      seriesId: series.id,
      seriesPart: seriesData.part || null,
    },
  });

  const seriesPostsCount = await tx.blogPost.count({ where: { seriesId: series.id } });

  await tx.series.update({
    where: { id: series.id },
    data: { totalParts: seriesPostsCount },
  });
};

export const createBlogTags = async (
  tx: Prisma.TransactionClient,
  blogPostId: number,
  tags: TagData[]
): Promise<void> => {
  for (const tagData of tags) {
    const tag = await tx.blogTag.upsert({
      where: { name: tagData.name },
      update: {},
      create: {
        name: tagData.name,
        slug: tagData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      },
    });

    await tx.blogPostTag.create({
      data: {
        blogPostId,
        blogTagId: tag.id,
      },
    });
  }
};

export const createBlogCategory = async (
  tx: Prisma.TransactionClient,
  categoryData: CategoryData | null
): Promise<{ id: number } | null> => {
  if (!categoryData?.name) return null;

  const category = await tx.category.upsert({
    where: { name: categoryData.name },
    update: {},
    create: {
      name: categoryData.name,
      slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    },
  });

  return category;
};

export const calculateWordCount = (blocks: ContentBlockInput[]): number => {
  return blocks.reduce((total, block) => {
    if (block.content && typeof block.content === 'string') {
      return total + block.content.trim().split(/\s+/).length;
    }
    return total;
  }, 0);
};
