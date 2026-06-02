-- CreateEnum
CREATE TYPE "ShippingCoverage" AS ENUM ('SUPPLIER_COVERS', 'BUYER_COVERS');

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "shippingCoverage" "ShippingCoverage" NOT NULL DEFAULT 'BUYER_COVERS';
