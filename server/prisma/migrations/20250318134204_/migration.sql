-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "expectedSalary" INTEGER NOT NULL,
    "expectedDateOfDefense" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);
