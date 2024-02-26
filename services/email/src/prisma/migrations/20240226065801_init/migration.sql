-- CreateEnum
CREATE TYPE "EmailSource" AS ENUM ('ACCOUNT_ACTIVATION', 'EMAIL_CHANGE', 'RESET_PASSWORD');

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "recepient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "source" "EmailSource" NOT NULL DEFAULT 'ACCOUNT_ACTIVATION',
    "body" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);
