import { PrismaClient, UserRole, ShippingCoverage } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function randomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
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

  const categories = ['Charger', 'Kabel Data', 'Audio', 'Pelindung Layar', 'Powerbank'];

  const supplierData = [
    { name: 'PT Teknologi Maju', category: 'Charger', productBrand: 'Baseus', contactPerson: 'Andi Wijaya', phone: '08123456701', address: 'Jl. Merdeka No. 10, Jakarta' },
    { name: 'CV Sinar Digital', category: 'Kabel Data', productBrand: 'Ugreen', contactPerson: 'Budi Santoso', phone: '08123456702', address: 'Jl. Sudirman No. 45, Bandung' },
    { name: 'UD Aksesoris Jaya', category: 'Pelindung Layar', productBrand: 'Mocolo', contactPerson: 'Citra Dewi', phone: '08123456703', address: 'Jl. Ahmad Yani No. 22, Surabaya' },
    { name: 'PT Mega Elektronik', category: 'Audio', productBrand: 'Soundcore', contactPerson: 'Dian Pratama', phone: '08123456704', address: 'Jl. Gatot Subroto No. 88, Jakarta' },
    { name: 'CV Berkah Logistik', category: 'Powerbank', productBrand: 'Vivan', contactPerson: 'Eko Nugroho', phone: '08123456705', address: 'Jl. Pahlawan No. 15, Semarang' },
    { name: 'PT Kualitas Prima', category: 'Case', productBrand: 'Nillkin', contactPerson: 'Fitri Handayani', phone: '08123456706', address: 'Jl. Diponegoro No. 33, Yogyakarta' },
    { name: 'CV Tech Supply', category: 'Holder', productBrand: 'Robot', contactPerson: 'Gunawan Hidayat', phone: '08123456707', address: 'Jl. Veteran No. 7, Malang' },
    { name: 'UD Bahan Baku Utama', category: 'Kabel Data', productBrand: 'Baseus', contactPerson: 'Hendra Kusuma', phone: '08123456708', address: 'Jl. Raya Industri No. 50, Bekasi' },
    { name: 'PT Distribusi Nusantara', category: 'Charger', productBrand: 'Anker', contactPerson: 'Indah Lestari', phone: '08123456709', address: 'Jl. Pelabuhan No. 12, Makassar' },
    { name: 'CV Aksesoris Official', category: 'Audio', productBrand: 'JBL', contactPerson: 'Joko Susilo', phone: '08123456710', address: 'Jl. Thamrin No. 28, Medan' },
    { name: 'PT Prima Aksesori', category: 'Pelindung Layar', productBrand: 'Spigen', contactPerson: 'Kartika Sari', phone: '08123456711', address: 'Jl. Asia Afrika No. 5, Bandung' },
    { name: 'CV Distributor Aksesori', category: 'Case', productBrand: 'Spigen', contactPerson: 'Lukman Hakim', phone: '08123456712', address: 'Jl. Pemuda No. 18, Surabaya' },
    { name: 'UD Aksesori Murah', category: 'Holder', productBrand: 'Oraimo', contactPerson: 'Maya Anggraini', phone: '08123456713', address: 'Jl. Pendidikan No. 9, Depok' },
    { name: 'PT Advance Aksesori', category: 'Powerbank', productBrand: 'Anker', contactPerson: 'Nanda Putra', phone: '08123456714', address: 'Jl. Teknologi No. 3, Tangerang' },
    { name: 'CV Polytron Aksesori', category: 'Kabel Data', productBrand: 'Robot', contactPerson: 'Olivia Tan', phone: '08123456715', address: 'Jl. Industri No. 66, Batam' },
  ];

  const suppliers = await Promise.all(
    supplierData.map((s) =>
      prisma.supplier.create({
        data: {
          ...s,
          priceScore: randomFloat(6, 10),
          qualityScore: randomFloat(6, 10),
          deliveryScore: randomFloat(5, 10),
          serviceScore: randomFloat(5, 10),
          capacityScore: randomFloat(5, 10),
          shippingCoverage: Math.random() > 0.4 ? ShippingCoverage.SUPPLIER_COVERS : ShippingCoverage.BUYER_COVERS,
          status: 'ACTIVE',
        },
      })
    )
  );

  const selected = suppliers.filter((_, i) => i % 2 === 0).slice(0, 5);
  const spkResults = selected.map((s, i) => {
    const price = Number(s.priceScore);
    const quality = Number(s.qualityScore);
    const delivery = Number(s.deliveryScore);
    const service = Number(s.serviceScore);
    const capacity = Number(s.capacityScore);
    const shippingBonus = s.shippingCoverage === 'SUPPLIER_COVERS' ? 0.5 : 0;
    const totalScore = price * 0.3 + quality * 0.3 + delivery * 0.2 + service * 0.1 + capacity * 0.1 + shippingBonus;

    return {
      type: 'SUPPLIER_SELECTION',
      referenceId: s.id,
      score: parseFloat(totalScore.toFixed(2)),
      rank: i + 1,
      details: {
        name: s.name,
        category: s.category,
        totalScore: parseFloat(totalScore.toFixed(2)),
        recommended: totalScore >= 7.5,
        status: i < 3 ? 'RECOMMENDED' : 'PENDING',
      },
    };
  });

  for (const r of spkResults) {
    await prisma.spkResult.create({ data: r });
    await prisma.supplier.update({
      where: { id: r.referenceId! },
      data: { totalScore: r.score, status: r.rank <= 3 ? 'RECOMMENDED' : 'ACTIVE' },
    });
  }

  console.log('========================================');
  console.log('  SEED DATA BERHASIL DIBUAT!');
  console.log('========================================');
  console.log(`  User           : ${[admin, ...users].length} akun`);
  console.log(`  Supplier       : ${suppliers.length} supplier`);
  console.log(`  SPK Result     : ${spkResults.length} hasil evaluasi`);
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
