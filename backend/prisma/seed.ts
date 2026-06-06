import { PrismaClient, ShippingCoverage, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const supplierData = [
  {
    name: 'Pontianak Mobile Grosir',
    category: 'Charger',
    productBrand: 'Baseus',
    contactPerson: 'Andi Saputra',
    phone: '0812-5600-1101',
    address: 'Jl. Gajah Mada, Pontianak Kota, Kalimantan Barat',
    priceScore: 9.1,
    qualityScore: 9.0,
    deliveryScore: 8.8,
    serviceScore: 8.6,
    capacityScore: 9.2,
    shippingCoverage: ShippingCoverage.BUYER_COVERS,
    notes: 'Menyediakan charger dengan berbagai merek.',
  },
  {
    name: 'Khatulistiwa Gadget Supply',
    category: 'Kabel Data',
    productBrand: 'Ugreen',
    contactPerson: 'Rina Oktaviani',
    phone: '0813-4500-2202',
    address: 'Jl. Ahmad Yani, Pontianak Selatan, Kalimantan Barat',
    priceScore: 8.6,
    qualityScore: 9.3,
    deliveryScore: 9.0,
    serviceScore: 8.9,
    capacityScore: 8.8,
    shippingCoverage: ShippingCoverage.SUPPLIER_COVERS,
    notes: 'Menyediakan kabel data dan aksesoris gadget.',
  },
  {
    name: 'Borneo Tech Distributor',
    category: 'Aksesoris Premium',
    productBrand: 'Baseus',
    contactPerson: 'Yusuf Pratama',
    phone: '0852-4600-4404',
    address: 'Jl. Veteran, Pontianak Timur, Kalimantan Barat',
    priceScore: 8.2,
    qualityScore: 9.5,
    deliveryScore: 8.4,
    serviceScore: 8.8,
    capacityScore: 8.6,
    shippingCoverage: ShippingCoverage.BUYER_COVERS,
    notes: 'Menyediakan aksesoris premium.',
  },
  {
    name: 'Mega Jaya Cellular Pontianak',
    category: 'Case',
    productBrand: 'Nillkin',
    contactPerson: 'Hendra Wijaya',
    phone: '0822-5100-6606',
    address: 'Jl. Sultan Abdurrahman, Pontianak Kota, Kalimantan Barat',
    priceScore: 8.9,
    qualityScore: 8.8,
    deliveryScore: 9.2,
    serviceScore: 8.7,
    capacityScore: 8.9,
    shippingCoverage: ShippingCoverage.BUYER_COVERS,
    notes: 'Menyediakan casing handphone.',
  },
  {
    name: 'JBL Audio Partner',
    category: 'Audio & Wearable',
    productBrand: 'JBL',
    contactPerson: 'Teguh Santoso',
    phone: '0822-5600-2021',
    address: 'Jl. Reformasi, Pontianak Tenggara, Kalimantan Barat',
    priceScore: 8.0,
    qualityScore: 9.4,
    deliveryScore: 8.3,
    serviceScore: 8.7,
    capacityScore: 8.2,
    shippingCoverage: ShippingCoverage.BUYER_COVERS,
    notes: 'Menyediakan perangkat audio.',
  },
];

function round4(value: number) {
  return Math.round(value * 10000) / 10000;
}

function calculateScores() {
  const raw = supplierData.map((supplier) => ({
    price: supplier.priceScore / 10,
    quality: supplier.qualityScore / 10,
    delivery: supplier.deliveryScore / 10,
    service: supplier.serviceScore / 10,
    capacity: supplier.capacityScore / 10,
  }));
  const minPrice = Math.min(...raw.map((item) => item.price));
  const maxQuality = Math.max(...raw.map((item) => item.quality));
  const maxDelivery = Math.max(...raw.map((item) => item.delivery));
  const maxService = Math.max(...raw.map((item) => item.service));
  const maxCapacity = Math.max(...raw.map((item) => item.capacity));

  return raw.map((item, index) => {
    const supplier = supplierData[index];
    const total =
      round4((minPrice / item.price) * 0.3) +
      round4((item.quality / maxQuality) * 0.3) +
      round4((item.delivery / maxDelivery) * 0.2) +
      round4((item.service / maxService) * 0.1) +
      round4((item.capacity / maxCapacity) * 0.1) +
      (supplier.shippingCoverage === ShippingCoverage.SUPPLIER_COVERS ? 0.05 : 0);

    return round4(total);
  });
}

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);

  await prisma.spkResult.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.user.deleteMany({});

  const admin = await prisma.user.create({
    data: { username: 'admin', password: hashed, role: UserRole.SUPER_ADMIN },
  });

  const users = await Promise.all([
    prisma.user.create({ data: { username: 'admin-hr', password: hashed, role: UserRole.ADMIN_HR } }),
    prisma.user.create({ data: { username: 'manager', password: hashed, role: UserRole.MANAGER } }),
    prisma.user.create({ data: { username: 'karyawan', password: hashed, role: UserRole.KARYAWAN } }),
  ]);

  const scores = calculateScores();
  const createdSuppliers = [];

  for (let index = 0; index < supplierData.length; index++) {
    const supplier = supplierData[index];
    createdSuppliers.push(await prisma.supplier.create({
      data: {
        ...supplier,
        totalScore: scores[index],
        status: 'ACTIVE',
      },
    }));
  }

  const ranked = createdSuppliers
    .map((supplier, index) => ({ supplier, score: scores[index] }))
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  for (const item of ranked) {
    await prisma.spkResult.create({
      data: {
        type: 'SUPPLIER_SELECTION',
        referenceId: item.supplier.id,
        score: item.score,
        rank: item.rank,
        details: {
          supplierId: item.supplier.id,
          name: item.supplier.name,
          category: item.supplier.category,
          productBrand: item.supplier.productBrand,
          totalScore: item.score,
          recommended: item.score >= 0.75,
          status: 'PENDING',
        },
      },
    });
  }

  console.log('========================================');
  console.log('  SEED DATA BERHASIL DIBUAT!');
  console.log('========================================');
  console.log(`  User           : ${[admin, ...users].length} akun`);
  console.log(`  Supplier       : ${createdSuppliers.length} supplier`);
  console.log(`  SPK Result     : ${ranked.length} hasil evaluasi`);
  console.log('========================================');
  console.log('  Login: admin / admin123 (SUPER_ADMIN)');
  console.log('  Login: admin-hr / admin123');
  console.log('  Login: manager / admin123');
  console.log('  Login: karyawan / admin123');
  console.log('========================================');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
