CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "contactPerson" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "priceScore" DECIMAL(5,2) NOT NULL,
    "qualityScore" DECIMAL(5,2) NOT NULL,
    "deliveryScore" DECIMAL(5,2) NOT NULL,
    "serviceScore" DECIMAL(5,2) NOT NULL,
    "capacityScore" DECIMAL(5,2) NOT NULL,
    "totalScore" DECIMAL(5,2),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);
