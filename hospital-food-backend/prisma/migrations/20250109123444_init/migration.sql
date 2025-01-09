-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'PANTRY_STAFF', 'DELIVERY_PERSONNEL');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MealTime" AS ENUM ('MORNING', 'EVENING', 'NIGHT');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'IN_DELIVERY', 'DELIVERED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "bedNumber" TEXT NOT NULL,
    "floorNumber" TEXT NOT NULL,
    "diseases" TEXT[],
    "allergies" TEXT[],
    "contactNumber" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietChart" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "dietChartId" TEXT NOT NULL,
    "mealTime" "MealTime" NOT NULL,
    "ingredients" TEXT[],
    "instructions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PantryStaff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PantryStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryPersonnel" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryPersonnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealDelivery" (
    "id" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "pantryStaffId" TEXT NOT NULL,
    "deliveryPersonnelId" TEXT,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PantryStaff_userId_key" ON "PantryStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPersonnel_userId_key" ON "DeliveryPersonnel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MealDelivery_mealId_key" ON "MealDelivery"("mealId");

-- AddForeignKey
ALTER TABLE "DietChart" ADD CONSTRAINT "DietChart_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_dietChartId_fkey" FOREIGN KEY ("dietChartId") REFERENCES "DietChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryStaff" ADD CONSTRAINT "PantryStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPersonnel" ADD CONSTRAINT "DeliveryPersonnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealDelivery" ADD CONSTRAINT "MealDelivery_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealDelivery" ADD CONSTRAINT "MealDelivery_pantryStaffId_fkey" FOREIGN KEY ("pantryStaffId") REFERENCES "PantryStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealDelivery" ADD CONSTRAINT "MealDelivery_deliveryPersonnelId_fkey" FOREIGN KEY ("deliveryPersonnelId") REFERENCES "DeliveryPersonnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
