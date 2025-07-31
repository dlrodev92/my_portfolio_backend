-- CreateEnum
CREATE TYPE "AssessmentContentType" AS ENUM ('PARAGRAPH', 'HEADING');

-- AlterTable
ALTER TABLE "technologies" ADD COLUMN     "assessmentId" INTEGER,
ALTER COLUMN "reason" DROP NOT NULL,
ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "assessments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mainImage" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_content_blocks" (
    "id" SERIAL NOT NULL,
    "type" "AssessmentContentType" NOT NULL DEFAULT 'PARAGRAPH',
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "level" INTEGER,
    "assessmentId" INTEGER NOT NULL,

    CONSTRAINT "assessment_content_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assessmentId" INTEGER NOT NULL,

    CONSTRAINT "assessment_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_files" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER,
    "mimeType" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assessmentId" INTEGER NOT NULL,

    CONSTRAINT "assessment_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_tags" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessmentId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "assessment_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessments_slug_key" ON "assessments"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_tags_assessmentId_tagId_key" ON "assessment_tags"("assessmentId", "tagId");

-- AddForeignKey
ALTER TABLE "technologies" ADD CONSTRAINT "technologies_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_content_blocks" ADD CONSTRAINT "assessment_content_blocks_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_images" ADD CONSTRAINT "assessment_images_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_files" ADD CONSTRAINT "assessment_files_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_tags" ADD CONSTRAINT "assessment_tags_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_tags" ADD CONSTRAINT "assessment_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
