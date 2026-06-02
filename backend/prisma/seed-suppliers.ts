import { PrismaClient, ShippingCoverage } from '@prisma/client';

const prisma = new PrismaClient();

type SupplierSeed = {
  name: string;
  category: string;
  productBrand: string;
  contactPerson: string;
  phone: string;
  address: string;
  priceScore: number;
  qualityScore: number;
  deliveryScore: number;
  serviceScore: number;
  capacityScore: number;
  shippingCoverage?: ShippingCoverage;
  notes: string;
};

const suppliers: SupplierSeed[] = [
  {
    name: 'Pontianak Mobile Grosir',
    category: 'Charger',
    productBrand: 'Fast Charger',
    contactPerson: 'Andi Saputra',
    phone: '0812-5600-1101',
    address: 'Jl. Gajah Mada, Pontianak Kota, Kalimantan Barat',
    priceScore: 91,
    qualityScore: 90,
    deliveryScore: 88,
    serviceScore: 86,
    capacityScore: 92,
    notes: 'Stok charger cepat stabil, cocok untuk pembelian grosir aksesori.',
  },
  {
    name: 'Khatulistiwa Gadget Supply',
    category: 'Kabel Data',
    productBrand: 'Kabel Type-C',
    contactPerson: 'Rina Oktaviani',
    phone: '0813-4500-2202',
    address: 'Jl. Ahmad Yani, Pontianak Selatan, Kalimantan Barat',
    priceScore: 86,
    qualityScore: 93,
    deliveryScore: 90,
    serviceScore: 89,
    capacityScore: 88,
    shippingCoverage: ShippingCoverage.SUPPLIER_COVERS,
    notes: 'Kualitas barang sangat baik dan variasi tipe gadget lengkap.',
  },
  {
    name: 'Kapuas Aksesoris Cell',
    category: 'Aksesoris HP',
    productBrand: 'Baseus',
    contactPerson: 'Fajar Nugroho',
    phone: '0821-5500-3303',
    address: 'Jl. Tanjungpura, Pontianak Kota, Kalimantan Barat',
    priceScore: 94,
    qualityScore: 84,
    deliveryScore: 87,
    serviceScore: 82,
    capacityScore: 90,
    notes: 'Harga aksesori kompetitif untuk casing, tempered glass, kabel, dan holder.',
  },
  {
    name: 'Borneo Tech Distributor',
    category: 'Aksesori Premium',
    productBrand: 'Baseus',
    contactPerson: 'Yusuf Pratama',
    phone: '0852-4600-4404',
    address: 'Jl. Veteran, Pontianak Timur, Kalimantan Barat',
    priceScore: 82,
    qualityScore: 95,
    deliveryScore: 84,
    serviceScore: 88,
    capacityScore: 86,
    notes: 'Produk aksesori premium, cocok untuk segmen mid-high seperti charger fast charging dan TWS.',
  },
  {
    name: 'Equator Phone Parts',
    category: 'Sparepart Aksesori',
    productBrand: 'OEM',
    contactPerson: 'Maya Sari',
    phone: '0812-5700-5505',
    address: 'Jl. HOS Cokroaminoto, Pontianak Kota, Kalimantan Barat',
    priceScore: 88,
    qualityScore: 87,
    deliveryScore: 85,
    serviceScore: 84,
    capacityScore: 83,
    notes: 'Supplier sparepart konektor, baterai kecil, dan komponen servis aksesori.',
  },
  {
    name: 'Mega Jaya Cellular Pontianak',
    category: 'Case',
    productBrand: 'Softcase',
    contactPerson: 'Hendra Wijaya',
    phone: '0822-5100-6606',
    address: 'Jl. Sultan Abdurrahman, Pontianak Kota, Kalimantan Barat',
    priceScore: 89,
    qualityScore: 88,
    deliveryScore: 92,
    serviceScore: 87,
    capacityScore: 89,
    notes: 'Pengiriman cepat dalam kota dan stok unit fast moving cukup aman.',
  },
  {
    name: 'Mandiri Charger & Powerbank',
    category: 'Charger & Powerbank',
    productBrand: 'Anker',
    contactPerson: 'Siska Amelia',
    phone: '0813-4800-7707',
    address: 'Jl. Prof. M. Yamin, Pontianak Selatan, Kalimantan Barat',
    priceScore: 90,
    qualityScore: 86,
    deliveryScore: 86,
    serviceScore: 85,
    capacityScore: 87,
    notes: 'Fokus charger, kabel data, adaptor, powerbank, dan aksesoris charging.',
  },
  {
    name: 'Sungai Raya Gadget Partner',
    category: 'Paket Aksesori',
    productBrand: 'Baseus',
    contactPerson: 'Dedi Kurniawan',
    phone: '0853-4900-8808',
    address: 'Jl. Arteri Supadio, Kubu Raya/Pontianak Area, Kalimantan Barat',
    priceScore: 85,
    qualityScore: 85,
    deliveryScore: 93,
    serviceScore: 90,
    capacityScore: 84,
    notes: 'Respons cepat dan pengiriman fleksibel untuk area Pontianak dan Kubu Raya.',
  },
  {
    name: 'Nusantara Audio Gadget',
    category: 'Audio & Wearable',
    productBrand: 'Anker',
    contactPerson: 'Putri Lestari',
    phone: '0811-5600-9909',
    address: 'Jl. Imam Bonjol, Pontianak Tenggara, Kalimantan Barat',
    priceScore: 83,
    qualityScore: 89,
    deliveryScore: 82,
    serviceScore: 86,
    capacityScore: 80,
    notes: 'Produk earphone, headset, speaker bluetooth, TWS, dan smartwatch.',
  },
  {
    name: 'Ayani Digital Wholesale',
    category: 'Gadget Grosir',
    productBrand: 'Ugreen',
    contactPerson: 'Kevin Halim',
    phone: '0821-5200-1010',
    address: 'Jl. Ahmad Yani, Pontianak Selatan, Kalimantan Barat',
    priceScore: 87,
    qualityScore: 91,
    deliveryScore: 89,
    serviceScore: 92,
    capacityScore: 91,
    notes: 'Alternatif kuat untuk paket campuran aksesori fast moving.',
  },
  {
    name: 'Sentra Aksesori Kalbar',
    category: 'Pelindung Layar',
    productBrand: 'Tempered Glass',
    contactPerson: 'Ari Wibowo',
    phone: '0812-5400-1112',
    address: 'Jl. Teuku Umar, Pontianak Kota, Kalimantan Barat',
    priceScore: 84,
    qualityScore: 88,
    deliveryScore: 86,
    serviceScore: 85,
    capacityScore: 87,
    notes: 'Supplier khusus pelindung layar untuk stok retail dan paket promo toko.',
  },
  {
    name: 'Pontianak Aksesori Center Supply',
    category: 'Charger',
    productBrand: 'Charger Wireless',
    contactPerson: 'Lina Marlina',
    phone: '0813-5500-1213',
    address: 'Jl. Pahlawan, Pontianak Selatan, Kalimantan Barat',
    priceScore: 92,
    qualityScore: 87,
    deliveryScore: 84,
    serviceScore: 83,
    capacityScore: 86,
    notes: 'Harga charger kompetitif untuk stok reguler dan paket bundling.',
  },
  {
    name: 'Ugreen Power Pontianak',
    category: 'Charger & Powerbank',
    productBrand: 'Ugreen',
    contactPerson: 'Bima Hartono',
    phone: '0821-5300-1415',
    address: 'Jl. Dr. Sutomo, Pontianak Kota, Kalimantan Barat',
    priceScore: 86,
    qualityScore: 92,
    deliveryScore: 85,
    serviceScore: 88,
    capacityScore: 84,
    shippingCoverage: ShippingCoverage.SUPPLIER_COVERS,
    notes: 'Produk Ugreen untuk kabel, adaptor, hub, dan powerbank premium.',
  },
  {
    name: 'Robot Aksesoris Mandiri',
    category: 'Aksesoris HP',
    productBrand: 'Robot',
    contactPerson: 'Nadia Permata',
    phone: '0852-5700-1617',
    address: 'Jl. Danau Sentarum, Pontianak Kota, Kalimantan Barat',
    priceScore: 89,
    qualityScore: 84,
    deliveryScore: 88,
    serviceScore: 86,
    capacityScore: 85,
    notes: 'Supplier brand Robot untuk kabel data, charger, headset, dan aksesoris harian.',
  },
  {
    name: 'Vivan Gadget Wholesale',
    category: 'Charger & Powerbank',
    productBrand: 'Vivan',
    contactPerson: 'Rio Prakoso',
    phone: '0811-5700-1819',
    address: 'Jl. Kom Yos Sudarso, Pontianak Barat, Kalimantan Barat',
    priceScore: 87,
    qualityScore: 86,
    deliveryScore: 87,
    serviceScore: 84,
    capacityScore: 88,
    notes: 'Fokus brand Vivan untuk powerbank, adaptor, kabel, dan aksesoris charging.',
  },
  {
    name: 'JBL Audio Partner',
    category: 'Audio & Wearable',
    productBrand: 'JBL',
    contactPerson: 'Teguh Santoso',
    phone: '0822-5600-2021',
    address: 'Jl. Reformasi, Pontianak Tenggara, Kalimantan Barat',
    priceScore: 80,
    qualityScore: 94,
    deliveryScore: 83,
    serviceScore: 87,
    capacityScore: 82,
    notes: 'Supplier audio JBL untuk speaker bluetooth, headset, dan perangkat audio premium.',
  },
  {
    name: 'Oraimo Mobile Accessories',
    category: 'Aksesoris HP',
    productBrand: 'Oraimo',
    contactPerson: 'Citra Amelia',
    phone: '0813-5900-2223',
    address: 'Jl. Gusti Hamzah, Pontianak Kota, Kalimantan Barat',
    priceScore: 88,
    qualityScore: 85,
    deliveryScore: 86,
    serviceScore: 88,
    capacityScore: 84,
    notes: 'Pilihan untuk audio entry-level dan charging device.',
  },
];

function scoreValue(score: number) {
  return score > 10 ? Number((score / 10).toFixed(1)) : score;
}

function supplierScore(supplier: SupplierSeed) {
  return Number((
    scoreValue(supplier.priceScore) * 0.3 +
    scoreValue(supplier.qualityScore) * 0.3 +
    scoreValue(supplier.deliveryScore) * 0.2 +
    scoreValue(supplier.serviceScore) * 0.1 +
    scoreValue(supplier.capacityScore) * 0.1 +
    (supplier.shippingCoverage === ShippingCoverage.SUPPLIER_COVERS ? 0.5 : 0)
  ).toFixed(2));
}

async function main() {
  await prisma.spkResult.deleteMany({ where: { type: 'SUPPLIER_SELECTION' } });
  await prisma.supplier.deleteMany({});

  const created = [];
  for (const supplier of suppliers) {
    created.push(await prisma.supplier.create({
      data: {
        ...supplier,
        priceScore: scoreValue(supplier.priceScore),
        qualityScore: scoreValue(supplier.qualityScore),
        deliveryScore: scoreValue(supplier.deliveryScore),
        serviceScore: scoreValue(supplier.serviceScore),
        capacityScore: scoreValue(supplier.capacityScore),
        totalScore: supplierScore(supplier),
        status: 'ACTIVE',
      },
    }));
  }

  const ranked = [...created]
    .sort((a, b) => Number(b.totalScore) - Number(a.totalScore))
    .map((supplier, index) => ({ supplier, rank: index + 1, score: Number(supplier.totalScore) }));

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
          contactPerson: item.supplier.contactPerson,
          phone: item.supplier.phone,
          priceScore: Number(item.supplier.priceScore),
          qualityScore: Number(item.supplier.qualityScore),
          deliveryScore: Number(item.supplier.deliveryScore),
          serviceScore: Number(item.supplier.serviceScore),
          capacityScore: Number(item.supplier.capacityScore),
          shippingCoverage: item.supplier.shippingCoverage,
          shippingBonus: item.supplier.shippingCoverage === ShippingCoverage.SUPPLIER_COVERS ? 0.5 : 0,
          totalScore: item.score,
          recommended: item.score >= 7.5,
          status: item.rank === 1 ? 'APPROVED' : 'PENDING',
        },
      },
    });
  }

  console.log('Data supplier Pontianak siap untuk presentasi.');
  console.log(`Supplier dibuat: ${created.length}`);
  console.log(`Supplier terbaik: ${ranked[0].supplier.name} (${ranked[0].score})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
