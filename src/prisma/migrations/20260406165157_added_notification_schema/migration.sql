-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('SYSTEM', 'CUSTOM');

-- CreateEnum
CREATE TYPE "NotificationLogType" AS ENUM ('DEFAULT', 'MANUAL');

-- CreateEnum
CREATE TYPE "RecipientType" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RunMode" AS ENUM ('SYSTEM', 'PERIODICALLY', 'SCHEDULED', 'MANUAL');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('NEW', 'PROGRESS', 'ERROR', 'OK');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('EMAIL', 'SMS', 'WEB_PUSH', 'IN_APP');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('ADMIN', 'SYSTEM');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "runMode" "RunMode" NOT NULL DEFAULT 'SYSTEM',
    "eventCode" TEXT,
    "cronExpression" TEXT,
    "nextRunningDate" TIMESTAMP(3),
    "lastRunningDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationChannel" (
    "id" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "channel" "ChannelType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "providerCode" TEXT NOT NULL,

    CONSTRAINT "NotificationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationChannelContent" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "subject" TEXT,
    "messageText" TEXT,
    "messageHTML" TEXT,

    CONSTRAINT "NotificationChannelContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationProvider" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "channel" "ChannelType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "senderType" "SenderType" NOT NULL DEFAULT 'SYSTEM',
    "senderId" TEXT,
    "notificationId" TEXT,
    "recipientId" TEXT,
    "recipientType" "RecipientType" NOT NULL,
    "contentId" TEXT,
    "subject" TEXT,
    "messageBody" TEXT,
    "status" "MessageStatus" NOT NULL DEFAULT 'NEW',
    "errorMessage" TEXT,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "providerId" TEXT,
    "channelType" "ChannelType",
    "logType" "NotificationLogType" NOT NULL DEFAULT 'DEFAULT',
    "notificationChannelId" TEXT,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDefinition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "EventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_eventCode_idx" ON "Notification"("eventCode");

-- CreateIndex
CREATE INDEX "Notification_nextRunningDate_idx" ON "Notification"("nextRunningDate");

-- CreateIndex
CREATE INDEX "NotificationChannel_notificationId_idx" ON "NotificationChannel"("notificationId");

-- CreateIndex
CREATE INDEX "NotificationChannel_providerCode_idx" ON "NotificationChannel"("providerCode");

-- CreateIndex
CREATE INDEX "NotificationChannelContent_channelId_idx" ON "NotificationChannelContent"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationProvider_code_key" ON "NotificationProvider"("code");

-- CreateIndex
CREATE INDEX "NotificationLog_recipientId_idx" ON "NotificationLog"("recipientId");

-- CreateIndex
CREATE INDEX "NotificationLog_status_idx" ON "NotificationLog"("status");

-- CreateIndex
CREATE INDEX "NotificationLog_createdAt_idx" ON "NotificationLog"("createdAt");

-- CreateIndex
CREATE INDEX "NotificationLog_notificationId_idx" ON "NotificationLog"("notificationId");

-- CreateIndex
CREATE INDEX "NotificationLog_notificationChannelId_idx" ON "NotificationLog"("notificationChannelId");

-- CreateIndex
CREATE INDEX "NotificationLog_recipientId_status_idx" ON "NotificationLog"("recipientId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EventDefinition_code_key" ON "EventDefinition"("code");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventCode_fkey" FOREIGN KEY ("eventCode") REFERENCES "EventDefinition"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChannel" ADD CONSTRAINT "NotificationChannel_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChannel" ADD CONSTRAINT "NotificationChannel_providerCode_fkey" FOREIGN KEY ("providerCode") REFERENCES "NotificationProvider"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationChannelContent" ADD CONSTRAINT "NotificationChannelContent_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "NotificationChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "NotificationProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "NotificationChannelContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_notificationChannelId_fkey" FOREIGN KEY ("notificationChannelId") REFERENCES "NotificationChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
