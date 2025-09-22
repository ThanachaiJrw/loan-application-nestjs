-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MAKER', 'CHECKER', 'APPROVER', 'ADMIN');

-- CreateTable
CREATE TABLE "loan_users" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createBy" TEXT NOT NULL,
    "createdDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "loan_applications" (
    "app_no" TEXT NOT NULL,
    "customer_no" TEXT NOT NULL,
    "loan_amt" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT '100',
    "create_by" TEXT NOT NULL,
    "create_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_by" TEXT,
    "update_dt" TIMESTAMP(3),

    CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("app_no")
);

-- CreateTable
CREATE TABLE "loan_app_actions" (
    "action_id" TEXT NOT NULL,
    "app_no" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "action_type" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "create_by" TEXT NOT NULL,
    "create_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_by" TEXT,
    "update_dt" TIMESTAMP(3),

    CONSTRAINT "loan_app_actions_pkey" PRIMARY KEY ("action_id")
);

-- CreateTable
CREATE TABLE "loan_attachments" (
    "attachment_id" TEXT NOT NULL,
    "app_no" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    "doc_type" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_attachments_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "customer_info" (
    "customer_no" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "id_card" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "subdistrict" TEXT NOT NULL,
    "create_by" TEXT NOT NULL,
    "create_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_by" TEXT,
    "update_dt" TIMESTAMP(3),
    "postcode" TEXT NOT NULL,

    CONSTRAINT "customer_info_pkey" PRIMARY KEY ("customer_no")
);

-- CreateTable
CREATE TABLE "geographies" (
    "geo_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "geographies_pkey" PRIMARY KEY ("geo_no")
);

-- CreateTable
CREATE TABLE "provinces" (
    "province_no" TEXT NOT NULL,
    "province_code" TEXT NOT NULL,
    "province_th_name" TEXT NOT NULL,
    "province_en_name" TEXT NOT NULL,
    "geo_no" TEXT NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("province_no")
);

-- CreateTable
CREATE TABLE "districts" (
    "district_no" TEXT NOT NULL,
    "district_code" TEXT NOT NULL,
    "district_th_name" TEXT NOT NULL,
    "district_en_name" TEXT NOT NULL,
    "province_no" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("district_no")
);

-- CreateTable
CREATE TABLE "subdistricts" (
    "subdistricts_no" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "subdistrict_th_name" TEXT NOT NULL,
    "subdistrict_en_name" TEXT NOT NULL,
    "district_no" TEXT NOT NULL,

    CONSTRAINT "subdistricts_pkey" PRIMARY KEY ("subdistricts_no")
);

-- CreateTable
CREATE TABLE "sequences_config" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "next_val" INTEGER NOT NULL,
    "updated_dt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sequences_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loan_users_email_key" ON "loan_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_info_id_card_key" ON "customer_info"("id_card");

-- CreateIndex
CREATE UNIQUE INDEX "customer_info_email_key" ON "customer_info"("email");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_province_code_key" ON "provinces"("province_code");

-- CreateIndex
CREATE UNIQUE INDEX "districts_district_code_key" ON "districts"("district_code");

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_customer_no_fkey" FOREIGN KEY ("customer_no") REFERENCES "customer_info"("customer_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_create_by_fkey" FOREIGN KEY ("create_by") REFERENCES "loan_users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_update_by_fkey" FOREIGN KEY ("update_by") REFERENCES "loan_users"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_app_actions" ADD CONSTRAINT "loan_app_actions_app_no_fkey" FOREIGN KEY ("app_no") REFERENCES "loan_applications"("app_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_app_actions" ADD CONSTRAINT "loan_app_actions_create_by_fkey" FOREIGN KEY ("create_by") REFERENCES "loan_users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_app_actions" ADD CONSTRAINT "loan_app_actions_update_by_fkey" FOREIGN KEY ("update_by") REFERENCES "loan_users"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_attachments" ADD CONSTRAINT "loan_attachments_app_no_fkey" FOREIGN KEY ("app_no") REFERENCES "loan_applications"("app_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_attachments" ADD CONSTRAINT "loan_attachments_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "loan_users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_info" ADD CONSTRAINT "customer_info_create_by_fkey" FOREIGN KEY ("create_by") REFERENCES "loan_users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_info" ADD CONSTRAINT "customer_info_update_by_fkey" FOREIGN KEY ("update_by") REFERENCES "loan_users"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_geo_no_fkey" FOREIGN KEY ("geo_no") REFERENCES "geographies"("geo_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_province_no_fkey" FOREIGN KEY ("province_no") REFERENCES "provinces"("province_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subdistricts" ADD CONSTRAINT "subdistricts_district_no_fkey" FOREIGN KEY ("district_no") REFERENCES "districts"("district_no") ON DELETE RESTRICT ON UPDATE CASCADE;

