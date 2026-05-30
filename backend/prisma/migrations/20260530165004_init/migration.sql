-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'PROBATION', 'RESIGNED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('PKWT', 'PKWTT');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('TAHUNAN', 'SAKIT', 'MELAHIRKAN', 'PENTING');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'CUTI', 'ALPHA');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('DRAFT', 'REVIEWED', 'PAID');

-- CreateEnum
CREATE TYPE "RecruitmentStage" AS ENUM ('SCREENING', 'INTERVIEW', 'OFFERING', 'ONBOARDING', 'HIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN_HR', 'MANAGER', 'KARYAWAN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'KARYAWAN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "managerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'STAFF',
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "photo" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT,
    "address" TEXT,
    "religion" TEXT,
    "education" TEXT,
    "maritalStatus" TEXT,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "contractType" "ContractType",
    "contractEnd" TIMESTAMP(3),
    "departmentId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emergencyName" TEXT,
    "emergencyPhone" TEXT,
    "emergencyRelation" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "status" "AttendanceStatus" NOT NULL DEFAULT 'HADIR',
    "overtimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaves" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "type" "LeaveType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payrolls" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "periodMonth" INTEGER NOT NULL,
    "periodYear" INTEGER NOT NULL,
    "basicSalary" DECIMAL(15,2) NOT NULL,
    "allowanceTransport" DECIMAL(15,2),
    "allowanceMeal" DECIMAL(15,2),
    "allowanceHealth" DECIMAL(15,2),
    "allowancePosition" DECIMAL(15,2),
    "overtimePay" DECIMAL(15,2) DEFAULT 0,
    "deductionLate" DECIMAL(15,2) DEFAULT 0,
    "deductionLoan" DECIMAL(15,2) DEFAULT 0,
    "deductionBpjsTk" DECIMAL(15,2) DEFAULT 0,
    "deductionBpjsKes" DECIMAL(15,2) DEFAULT 0,
    "deductionPph21" DECIMAL(15,2) DEFAULT 0,
    "thrAmount" DECIMAL(15,2) DEFAULT 0,
    "netSalary" DECIMAL(15,2) NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payrolls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performances" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "kpiScore" DECIMAL(5,2) NOT NULL,
    "selfScore" DECIMAL(5,2),
    "review360Score" DECIMAL(5,2),
    "totalScore" DECIMAL(5,2) NOT NULL,
    "grade" TEXT,
    "notes" TEXT,
    "reviewedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "performances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainings" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "cost" DECIMAL(15,2),
    "duration" INTEGER,
    "certificate" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_matrix" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "proficiency" INTEGER NOT NULL DEFAULT 1,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_matrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recruitments" (
    "id" SERIAL NOT NULL,
    "positionId" INTEGER NOT NULL,
    "candidateName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "cvPath" TEXT,
    "stage" "RecruitmentStage" NOT NULL DEFAULT 'SCREENING',
    "scoreExperience" DECIMAL(5,2),
    "scoreEducation" DECIMAL(5,2),
    "scoreInterview" DECIMAL(5,2),
    "scoreSoftskill" DECIMAL(5,2),
    "scoreSalary" DECIMAL(5,2),
    "totalScore" DECIMAL(5,2),
    "interviewDate" TIMESTAMP(3),
    "offerDate" TIMESTAMP(3),
    "onboardingDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recruitments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spk_results" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "referenceId" INTEGER,
    "employeeId" INTEGER,
    "score" DECIMAL(10,4) NOT NULL,
    "rank" INTEGER,
    "details" JSONB,
    "period" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spk_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "employees_nik_key" ON "employees"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_employeeId_date_key" ON "attendances"("employeeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "payrolls_employeeId_periodMonth_periodYear_key" ON "payrolls"("employeeId", "periodMonth", "periodYear");

-- CreateIndex
CREATE UNIQUE INDEX "performances_employeeId_period_key" ON "performances"("employeeId", "period");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skill_matrix_employeeId_skillId_key" ON "skill_matrix"("employeeId", "skillId");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performances" ADD CONSTRAINT "performances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_matrix" ADD CONSTRAINT "skill_matrix_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_matrix" ADD CONSTRAINT "skill_matrix_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruitments" ADD CONSTRAINT "recruitments_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
