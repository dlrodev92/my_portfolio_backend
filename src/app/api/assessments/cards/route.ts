import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        mainImage: true,
        createdAt: true,
        publishedAt: true,
        assessmentTags: {
          select: {
            tag: {
              select: {
                name: true,
              }
            }
          }
        },
        _count: {
          select: {
            assessmentTags: true,
            technologies: true,
            images: true,
            files: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const response = NextResponse.json(assessments);
    
   
    return response;
  } catch (error) {
    console.error('Get assessment cards error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment cards' },
      { status: 500 }
    );
  }
}