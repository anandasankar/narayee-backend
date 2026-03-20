-- CreateEnum
CREATE TYPE "EnquiryType" AS ENUM ('ONLINE_COURSE', 'OFFLINE_COURSE', 'DEMO_CLASS', 'CONSULTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "CallbackStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BATCH', 'COURSE', 'REVIEW', 'SYSTEM', 'OTHER');

-- CreateEnum
CREATE TYPE "TestimonialType" AS ENUM ('CAREER', 'GLOBAL');

-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('BSC', 'BCA', 'BTECH', 'MCA', 'MSC', 'MTECH', 'DIPLOMA', 'OTHER');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "Career" ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0.0;

-- CreateTable
CREATE TABLE "CallbackRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "preferredAt" TIMESTAMP(3) NOT NULL,
    "enquiryType" "EnquiryType" NOT NULL,
    "notes" TEXT,
    "status" "CallbackStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallbackRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "company" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "type" "TestimonialType" NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "submittedById" TEXT NOT NULL,
    "careerId" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "mobileNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isMobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "profileCompletion" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "college" TEXT,
    "degree" "Degree",
    "customDegree" TEXT,
    "graduationYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CallbackRequest_mobileNumber_idx" ON "CallbackRequest"("mobileNumber");

-- CreateIndex
CREATE INDEX "CallbackRequest_status_idx" ON "CallbackRequest"("status");

-- CreateIndex
CREATE INDEX "CallbackRequest_preferredAt_idx" ON "CallbackRequest"("preferredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_careerId_key" ON "Enrollment"("userId", "careerId");

-- CreateIndex
CREATE INDEX "Notification_active_publishedAt_idx" ON "Notification"("active", "publishedAt");

-- CreateIndex
CREATE INDEX "Testimonial_careerId_type_isApproved_isPublished_priority_idx" ON "Testimonial"("careerId", "type", "isApproved", "isPublished", "priority");

-- CreateIndex
CREATE INDEX "Testimonial_submittedById_idx" ON "Testimonial"("submittedById");

-- CreateIndex
CREATE INDEX "Testimonial_approvedById_idx" ON "Testimonial"("approvedById");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNumber_key" ON "User"("mobileNumber");

-- CreateIndex
CREATE INDEX "Education_userId_idx" ON "Education"("userId");

-- CreateIndex
CREATE INDEX "Education_college_idx" ON "Education"("college");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
