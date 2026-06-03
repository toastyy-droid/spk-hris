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
    priceScore: 9.1,
    qualityScore: 9.0,
    deliveryScore: 8.8,
    serviceScore: 8.6,
    capacityScore: 9.2,
    notes: 'Stok charger cepat stabil, cocok untuk pembelian grosir aksesori.',
  },
  {
    name: 'Khatulistiwa Gadget Supply',
    category: 'Kabel Data',
    productBrand: 'Kabel Type-C',
    contactPerson: 'Rina Oktaviani',
    phone: '0813-4500-2202',
    address: 'Jl. Ahmad Yani, Pontianak Selatan, Kalimantan Barat',
    priceScore: 8.6,
    qualityScore: 9.3,
    deliveryScore: 9.0,
    serviceScore: 8.9,
    capacityScore: 8.8,
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
    priceScore: 9.4,
    qualityScore: 8.4,
    deliveryScore: 8.7,
    serviceScore: 8.2,
    capacityScore: 9.0,
    notes: 'Harga aksesori kompetitif untuk casing, tempered glass, kabel, dan holder.',
  },
  {
    name: 'Borneo Tech Distributor',
    category: 'Aksesori Premium',
    productBrand: 'Baseus',
    contactPerson: 'Yusuf Pratama',
    phone: '0852-4600-4404',
    address: 'Jl. Veteran, Pontianak Timur, Kalimantan Barat',
    priceScore: 8.2,
    qualityScore: 9.5,
    deliveryScore: 8.4,
    serviceScore: 8.8,
    capacityScore: 8.6,
    notes: 'Produk aksesori premium, cocok untuk segmen mid-high seperti charger fast charging dan TWS.',
  },
  {
    name: 'Equator Phone Parts',
    category: 'Sparepart Aksesori',
    productBrand: 'OEM',
    contactPerson: 'Maya Sari',
    phone: '0812-5700-5505',
    address: 'Jl. HOS Cokroaminoto, Pontianak Kota, Kalimantan Barat',
    priceScore: 8.8,
    qualityScore: 8.7,
    deliveryScore: 8.5,
    serviceScore: 8.4,
    capacityScore: 8.3,
    notes: 'Supplier sparepart konektor, baterai kecil, dan komponen servis aksesori.',
  },
  {
    name: 'Mega Jaya Cellular Pontianak',
    category: 'Case',
    productBrand: 'Softcase',
    contactPerson: 'Hendra Wijaya',
    phone: '0822-5100-6606',
    address: 'Jl. Sultan Abdurrahman, Pontianak Kota, Kalimantan Barat',
    priceScore: 8.9,
    qualityScore: 8.8,
    deliveryScore: 9.2,
    serviceScore: 8.7,
    capacityScore: 8.9,
    notes: 'Pengiriman cepat dalam kota dan stok unit fast moving cukup aman.',
  },
  {
    name: 'Mandiri Charger & Powerbank',
    category: 'Charger & Powerbank',
    productBrand: 'Anker',
    contactPerson: 'Siska Amelia',
    phone: '0813-4800-7707',
    address: 'Jl. Prof. M. Yamin, Pontianak Selatan, Kalimantan Barat',
    priceScore: 9.0,
    qualityScore: 8.6,
    deliveryScore: 8.6,
    serviceScore: 8.5,
    capacityScore: 8.7,
    notes: 'Fokus charger, kabel data, adaptor, powerbank, dan aksesoris charging.',
  },
  {
    name: 'Sungai Raya Gadget Partner',
    category: 'Paket Aksesori',
    productBrand: 'Baseus',
    contactPerson: 'Dedi Kurniawan',
    phone: '0853-4900-8808',
    address: 'Jl. Arteri Supadio, Kubu Raya/Pontianak Area, Kalimantan Barat',
    priceScore: 8.5,
    qualityScore: 8.5,
    deliveryScore: 9.3,
    serviceScore: 9.0,
    capacityScore: 8.4,
    notes: 'Respons cepat dan pengiriman fleksibel untuk area Pontianak dan Kubu Raya.',
  },
  {
    name: 'Nusantara Audio Gadget',
    category: 'Audio & Wearable',
    productBrand: 'Anker',
    contactPerson: 'Putri Lestari',
    phone: '0811-5600-9909',
    address: 'Jl. Imam Bonjol, Pontianak Tenggara, Kalimantan Barat',
    priceScore: 8.3,
    qualityScore: 8.9,
    deliveryScore: 8.2,
    serviceScore: 8.6,
    capacityScore: 8.0,
    notes: 'Produk earphone, headset, speaker bluetooth, TWS, dan smartwatch.',
  },
  {
    name: 'Ayani Digital Wholesale',
    category: 'Gadget Grosir',
    productBrand: 'Ugreen',
    contactPerson: 'Kevin Halim',
    phone: '0821-5200-1010',
    address: 'Jl. Ahmad Yani, Pontianak Selatan, Kalimantan Barat',
    priceScore: 8.7,
    qualityScore: 9.1,
    deliveryScore: 8.9,
    serviceScore: 9.2,
    capacityScore: 9.1,
    notes: 'Alternatif kuat untuk paket campuran aksesori fast moving.',
  },
  {
    name: 'Sentra Aksesori Kalbar',
    category: 'Pelindung Layar',
    productBrand: 'Tempered Glass',
    contactPerson: 'Ari Wibowo',
    phone: '0812-5400-1112',
    address: 'Jl. Teuku Umar, Pontianak Kota, Kalimantan Barat',
    priceScore: 8.4,
    qualityScore: 8.8,
    deliveryScore: 8.6,
    serviceScore: 8.5,
    capacityScore: 8.7,
    notes: 'Supplier khusus pelindung layar untuk stok retail dan paket promo toko.',
  },
  {
    name: 'Pontianak Aksesori Center Supply',
    category: 'Charger',
    productBrand: 'Charger Wireless',
    contactPerson: 'Lina Marlina',
    phone: '0813-5500-1213',
    address: 'Jl. Pahlawan, Pontianak Selatan, Kalimantan Barat',
    priceScore: 9.2,
    qualityScore: 8.7,
    deliveryScore: 8.4,
    serviceScore: 8.3,
    capacityScore: 8.6,
    notes: 'Harga charger kompetitif untuk stok reguler dan paket bundling.',
  },
  {
    name: 'Ugreen Power Pontianak',
    category: 'Charger & Powerbank',
    productBrand: 'Ugreen',
    contactPerson: 'Bima Hartono',
    phone: '0821-5300-1415',
    address: 'Jl. Dr. Sutomo, Pontianak Kota, Kalimantan Barat',
    priceScore: 8.6,
    qualityScore: 9.2,
    deliveryScore: 8.5,
    serviceScore: 8.8,
    capacityScore: 8.4,
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
    priceScore: 8.9,
    qualityScore: 8.4,
    deliveryScore: 8.8,
    serviceScore: 8.6,
    capacityScore: 8.5,
    notes: 'Supplier brand Robot untuk kabel data, charger, headset, dan aksesoris harian.',
  },
  {
    name: 'Vivan Gadget Wholesale',
    category: 'Charger & Powerbank',
    productBrand: 'Vivan',
    contactPerson: 'Rio Prakoso',
    phone: '0811-5700-1819',
    address: 'Jl. Kom Yos Sudarso, Pontianak Barat, Kalimantan Barat',
    priceScore: 8.7,
    qualityScore: 8.6,
    deliveryScore: 8.7,
    serviceScore: 8.4,
    capacityScore: 8.8,
    notes: 'Fokus brand Vivan untuk powerbank, adaptor, kabel, dan aksesoris charging.',
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
    notes: 'Supplier audio JBL untuk speaker bluetooth, headset, dan perangkat audio premium.',
  },
  {
    name: 'Oraimo Mobile Accessories',
    category: 'Aksesoris HP',
    productBrand: 'Oraimo',
    contactPerson: 'Citra Amelia',
    phone: '0813-5900-2223',
    address: 'Jl. Gusti Hamzah, Pontianak Kota, Kalimantan Barat',
    priceScore: 8.8,
    qualityScore: 8.5,
    deliveryScore: 8.6,
    serviceScore: 8.8,
    capacityScore: 8.4,
    notes: 'Pilihan untuk audio entry-level dan charging device.',
  },
];

function sawCalculate(suppliers: SupplierSeed[]) {
  const raw = suppliers.map((s) => ({
    price: s.priceScore / 10,
    quality: s.qualityScore / 10,
    delivery: s.deliveryScore / 10,
    service: s.serviceScore / 10,
    capacity: s.capacityScore / 10,
  }));

  const minPrice = Math.min(...raw.map((r) => r.price));
  const maxQuality = Math.max(...raw.map((r) => r.quality));
  const maxDelivery = Math.max(...raw.map((r) => r.delivery));
  const maxService = Math.max(...raw.map((r) => r.service));
  const maxCapacity = Math.max(...raw.map((r) => r.capacity));

  return suppliers.map((supplier, i) => {
    const r = raw[i];
    const normalized = {
      price: minPrice / r.price,
      quality: r.quality / maxQuality,
      delivery: r.delivery / maxDelivery,
      service: r.service / maxService,
      capacity: r.capacity / maxCapacity,
    };

    let total = normalized.price * 0.3 + normalized.quality * 0.3 +
      normalized.delivery * 0.2 + normalized.service * 0.1 + normalized.capacity * 0.1;

    const bonus = supplier.shippingCoverage === ShippingCoverage.SUPPLIER_COVERS ? 0.05 : 0;
    total += bonus;

    return Number((Math.round(total * 10000) / 10000).toFixed(4));
  });
}

async function main() {
  await prisma.spkResult.deleteMany({ where: { type: 'SUPPLIER_SELECTION' } });
  await prisma.supplier.deleteMany({});

  const scores = sawCalculate(suppliers);

  const created = [];
  for (let i = 0; i < suppliers.length; i++) {
    const supplier = suppliers[i];
    created.push(await prisma.supplier.create({
      data: {
        name: supplier.name,
        category: supplier.category,
        productBrand: supplier.productBrand,
        contactPerson: supplier.contactPerson,
        phone: supplier.phone,
        address: supplier.address,
        priceScore: supplier.priceScore,
        qualityScore: supplier.qualityScore,
        deliveryScore: supplier.deliveryScore,
        serviceScore: supplier.serviceScore,
        capacityScore: supplier.capacityScore,
        shippingCoverage: supplier.shippingCoverage,
        totalScore: scores[i],
        status: 'ACTIVE',
        notes: supplier.notes,
      },
    }));
  }

  const THRESHOLD = 0.75;

  const ranked = [...created]
    .map((supplier, i) => ({ supplier, rank: 0, score: scores[i] }))
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
          contactPerson: item.supplier.contactPerson,
          phone: item.supplier.phone,
          priceScore: Number(item.supplier.priceScore),
          qualityScore: Number(item.supplier.qualityScore),
          deliveryScore: Number(item.supplier.deliveryScore),
          serviceScore: Number(item.supplier.serviceScore),
          capacityScore: Number(item.supplier.capacityScore),
          shippingCoverage: item.supplier.shippingCoverage,
          shippingBonus: item.supplier.shippingCoverage === ShippingCoverage.SUPPLIER_COVERS ? 0.05 : 0,
          totalScore: item.score,
          recommended: item.score >= THRESHOLD,
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
