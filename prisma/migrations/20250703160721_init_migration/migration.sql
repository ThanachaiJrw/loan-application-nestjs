-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'OFFICER', 'REVIEWER', 'ADMIN');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createBy" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Loan" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "createBy" TEXT NOT NULL,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedBy" TEXT,
    "reviewedDt" TIMESTAMP(3),
    "reviewedDes" TEXT,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "des_type" TEXT NOT NULL,
    "des_code" TEXT NOT NULL,
    "des_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'A',
    "createBy" TEXT NOT NULL,
    "createDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Config_des_type_des_code_key" ON "Config"("des_type", "des_code");

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_createBy_fkey" FOREIGN KEY ("createBy") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
