import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/create-spk.dto';

@Injectable()
export class SpkService {
  constructor(private prisma: PrismaService) {}

  private readonly WEIGHTS = { price: 0.3, quality: 0.3, delivery: 0.2, service: 0.1, capacity: 0.1 };
  private readonly COST_CRITERIA = ['price'];
  private readonly BENEFIT_CRITERIA = ['quality', 'delivery', 'service', 'capacity'];
  private demoResultStatus = new Map<number, string>();
  private demoAddedSupplierIds = new Set<number>();

  private readonly DEMO_SUPPLIERS = [
    {
      id: 1,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Stok charger cepat stabil, cocok untuk pembelian grosir aksesori.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 2,
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
      shippingCoverage: 'SUPPLIER_COVERS',
      status: 'ACTIVE',
      notes: 'Kualitas barang sangat baik dan variasi tipe gadget lengkap.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 3,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Produk aksesori premium, cocok untuk segmen mid-high seperti charger fast charging dan TWS.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 4,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Pengiriman cepat dalam kota dan stok unit fast moving cukup aman.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 5,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Supplier audio JBL untuk speaker bluetooth, headset, dan perangkat audio premium.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 6,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Harga aksesori kompetitif untuk casing, tempered glass, kabel, dan holder.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 7,
      name: 'Equator Phone Parts',
      category: 'Sparepart Aksesori',
      productBrand: 'Nillkin',
      contactPerson: 'Maya Sari',
      phone: '0812-5700-5505',
      address: 'Jl. HOS Cokroaminoto, Pontianak Kota, Kalimantan Barat',
      priceScore: 8.8,
      qualityScore: 8.7,
      deliveryScore: 8.5,
      serviceScore: 8.4,
      capacityScore: 8.3,
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Supplier sparepart konektor, baterai kecil, dan komponen servis aksesori.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 8,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Fokus charger, kabel data, adaptor, powerbank, dan aksesoris charging.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 9,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Respons cepat dan pengiriman fleksibel untuk area Pontianak dan Kubu Raya.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 10,
      name: 'Nusantara Audio Gadget',
      category: 'Audio & Wearable',
      productBrand: 'Soundcore',
      contactPerson: 'Putri Lestari',
      phone: '0811-5600-9909',
      address: 'Jl. Imam Bonjol, Pontianak Tenggara, Kalimantan Barat',
      priceScore: 8.3,
      qualityScore: 8.9,
      deliveryScore: 8.2,
      serviceScore: 8.6,
      capacityScore: 8.0,
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Produk earphone, headset, speaker bluetooth, TWS, dan smartwatch.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 11,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Alternatif kuat untuk paket campuran aksesori fast moving.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 12,
      name: 'Sentra Aksesori Kalbar',
      category: 'Pelindung Layar',
      productBrand: 'Mocolo',
      contactPerson: 'Ari Wibowo',
      phone: '0812-5400-1112',
      address: 'Jl. Teuku Umar, Pontianak Kota, Kalimantan Barat',
      priceScore: 8.4,
      qualityScore: 8.8,
      deliveryScore: 8.6,
      serviceScore: 8.5,
      capacityScore: 8.7,
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Supplier khusus pelindung layar untuk stok retail dan paket promo toko.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 13,
      name: 'Pontianak Aksesori Center Supply',
      category: 'Charger',
      productBrand: 'Anker',
      contactPerson: 'Lina Marlina',
      phone: '0813-5500-1213',
      address: 'Jl. Pahlawan, Pontianak Selatan, Kalimantan Barat',
      priceScore: 9.2,
      qualityScore: 8.7,
      deliveryScore: 8.4,
      serviceScore: 8.3,
      capacityScore: 8.6,
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Harga charger kompetitif untuk stok reguler dan paket bundling.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 14,
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
      shippingCoverage: 'SUPPLIER_COVERS',
      status: 'ACTIVE',
      notes: 'Produk Ugreen untuk kabel, adaptor, hub, dan powerbank premium.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 15,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Supplier brand Robot untuk kabel data, charger, headset, dan aksesoris harian.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 16,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Fokus brand Vivan untuk powerbank, adaptor, kabel, dan aksesoris charging.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 17,
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
      shippingCoverage: 'BUYER_COVERS',
      status: 'ACTIVE',
      notes: 'Pilihan untuk audio entry-level dan charging device.',
      totalScore: null,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ];

  private isLocalDemo() {
    return process.env.LOCAL_DEMO === 'true';
  }

  private isDemoSupplierVisible(id: number) {
    return id <= 5 || this.demoAddedSupplierIds.has(id);
  }

  private scoreDemoSuppliers<T extends { id: number; priceScore: number; qualityScore: number; deliveryScore: number; serviceScore: number; capacityScore: number; shippingCoverage: string }>(suppliers: T[]) {
    if (suppliers.length === 0) return new Map<number, number>();

    const raw = suppliers.map((s) => ({
      id: s.id,
      price: Number(s.priceScore) / 10,
      quality: Number(s.qualityScore) / 10,
      delivery: Number(s.deliveryScore) / 10,
      service: Number(s.serviceScore) / 10,
      capacity: Number(s.capacityScore) / 10,
    }));

    const minPrice = Math.min(...raw.map((r) => r.price));
    const maxValues = {
      quality: Math.max(...raw.map((r) => r.quality)),
      delivery: Math.max(...raw.map((r) => r.delivery)),
      service: Math.max(...raw.map((r) => r.service)),
      capacity: Math.max(...raw.map((r) => r.capacity)),
    };

    return new Map(
      suppliers.map((supplier, index) => {
        const calc = this.sawNormalizeAndScore(
          raw[index],
          minPrice,
          maxValues,
          supplier.shippingCoverage === 'SUPPLIER_COVERS',
        );
        return [supplier.id, calc.total];
      }),
    );
  }

  private round4(value: number) {
    return Math.round(value * 10000) / 10000;
  }

  private sawNormalizeAndScore(
    raw: { price: number; quality: number; delivery: number; service: number; capacity: number },
    minPrice: number,
    maxValues: { quality: number; delivery: number; service: number; capacity: number },
    hasBonus: boolean,
  ) {
    const normalized = {
      price: this.round4(minPrice / raw.price),
      quality: this.round4(raw.quality / maxValues.quality),
      delivery: this.round4(raw.delivery / maxValues.delivery),
      service: this.round4(raw.service / maxValues.service),
      capacity: this.round4(raw.capacity / maxValues.capacity),
    };

    let total =
      this.round4(normalized.price * this.WEIGHTS.price) +
      this.round4(normalized.quality * this.WEIGHTS.quality) +
      this.round4(normalized.delivery * this.WEIGHTS.delivery) +
      this.round4(normalized.service * this.WEIGHTS.service) +
      this.round4(normalized.capacity * this.WEIGHTS.capacity);

    if (hasBonus) {
      total += 0.05;
    }

    return {
      normalized,
      total: this.round4(total),
      bonus: hasBonus ? 0.05 : 0,
    };
  }

  private supplierPayload(data: CreateSupplierDto): Prisma.SupplierCreateInput {
    return {
      name: data.name,
      category: data.category,
      productBrand: data.productBrand,
      contactPerson: data.contactPerson,
      phone: data.phone,
      address: data.address,
      priceScore: data.priceScore,
      qualityScore: data.qualityScore,
      deliveryScore: data.deliveryScore,
      serviceScore: data.serviceScore,
      capacityScore: data.capacityScore,
      shippingCoverage: data.shippingCoverage,
      status: data.status,
      notes: data.notes,
      totalScore: undefined,
    };
  }

  async promotionCandidates(departmentId?: number, threshold = 75) {
    const employees = await this.prisma.employee.findMany({
      where: {
        status: 'ACTIVE',
        ...(departmentId ? { departmentId } : {}),
      },
      include: {
        department: true,
        position: true,
        skills: { include: { skill: true } },
        performances: { orderBy: { period: 'desc' }, take: 1 },
      },
    });

    const results: Array<{ employeeId: number; name: string; nik: string; department: string; position: string; kpiScore: number; masaKerja: number; skillMatch: number; totalScore: number; recommended: boolean; rank?: number }> = employees.map((emp) => {
      const latestPerf = emp.performances[0];
      const kpiScore = latestPerf ? Number(latestPerf.totalScore) : 0;
      const masaKerja = Math.floor((Date.now() - emp.joinDate.getTime()) / (365.25 * 86400000));
      const skillMatch = emp.skills.length > 0
        ? Math.min(emp.skills.reduce((s, sk) => s + sk.proficiency, 0) / (emp.skills.length * 5), 1) * 100
        : 50;

      const score =
        kpiScore * 0.4 +
        Math.min(masaKerja / 20, 1) * 100 * 0.2 +
        skillMatch * 0.2 +
        80 * 0.1 +
        80 * 0.1;

      return {
        employeeId: emp.id,
        name: emp.name,
        nik: emp.nik,
        department: emp.department.name,
        position: emp.position.name,
        kpiScore,
        masaKerja,
        skillMatch: Math.round(skillMatch),
        totalScore: Math.round(score * 100) / 100,
        recommended: score >= threshold,
      };
    });

    results.sort((a, b) => b.totalScore - a.totalScore);
    results.forEach((r, i) => { r.rank = i + 1; });

    const existing = await this.prisma.spkResult.findMany({
      where: { type: 'PROMOTION' },
    });
    const existingMap = new Map(existing.map((e) => [e.employeeId, e]));

    for (const r of results) {
      const prev = existingMap.get(r.employeeId);
      if (prev) {
        const prevDetails = prev.details as Record<string, unknown> | null;
        await this.prisma.spkResult.update({
          where: { id: prev.id },
          data: {
            score: r.totalScore,
            rank: r.rank,
            details: { ...r, status: prevDetails?.status ?? 'PENDING' } as any,
          },
        });
      } else {
        const created = await this.prisma.spkResult.create({
          data: {
            type: 'PROMOTION',
            employeeId: r.employeeId,
            score: r.totalScore,
            rank: r.rank,
            details: { ...r, status: 'PENDING' } as any,
          },
        });
        existingMap.set(r.employeeId, created);
      }
    }

    const candidatesWithId = results.map((r) => {
      const saved = existingMap.get(r.employeeId);
      const status = saved ? ((saved.details as Record<string, unknown>)?.status as string) ?? 'PENDING' : 'PENDING';
      return { ...r, resultId: saved?.id, status };
    });

    return { threshold, candidates: candidatesWithId };
  }

  async updateResult(id: number, data: { status?: string; notes?: string }) {
    if (this.isLocalDemo()) {
      if (data.status) this.demoResultStatus.set(id, data.status);
      return {
        id,
        type: 'SUPPLIER_SELECTION',
        score: null,
        rank: null,
        details: { status: data.status ?? 'PENDING', notes: data.notes },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const existing = await this.prisma.spkResult.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Result not found');
    const details = (existing.details as Record<string, unknown>) || {};
    return this.prisma.spkResult.update({
      where: { id },
      data: { details: { ...details, ...data } },
    });
  }

  async getSuppliers(category?: string, brand?: string) {
    if (this.isLocalDemo()) {
      const visible = this.DEMO_SUPPLIERS
        .filter((supplier) => this.isDemoSupplierVisible(supplier.id))
        .filter((supplier) => !category || supplier.category.toLowerCase().includes(category.toLowerCase()))
        .filter((supplier) => !brand || supplier.productBrand.toLowerCase().includes(brand.toLowerCase()));
      const scores = this.scoreDemoSuppliers(visible);
      return visible.map((supplier) => ({ ...supplier, totalScore: scores.get(supplier.id) ?? null }));
    }

    const suppliers = await this.prisma.supplier.findMany({
      where: {
        ...(category ? { category: { contains: category, mode: 'insensitive' as const } } : {}),
        ...(brand ? { productBrand: { contains: brand, mode: 'insensitive' as const } } : {}),
      },
      orderBy: { name: 'asc' },
    });

    const scorableSuppliers = suppliers
      .filter((supplier) => supplier.status === 'ACTIVE' || supplier.status === 'RECOMMENDED')
      .map((supplier) => ({
        id: supplier.id,
        priceScore: Number(supplier.priceScore),
        qualityScore: Number(supplier.qualityScore),
        deliveryScore: Number(supplier.deliveryScore),
        serviceScore: Number(supplier.serviceScore),
        capacityScore: Number(supplier.capacityScore),
        shippingCoverage: supplier.shippingCoverage,
      }));
    const scores = this.scoreDemoSuppliers(scorableSuppliers);

    return suppliers
      .map((supplier) => ({
        ...supplier,
        priceScore: Number(supplier.priceScore),
        qualityScore: Number(supplier.qualityScore),
        deliveryScore: Number(supplier.deliveryScore),
        serviceScore: Number(supplier.serviceScore),
        capacityScore: Number(supplier.capacityScore),
        totalScore: scores.get(supplier.id) ?? null,
      }))
      .sort((a, b) => (b.totalScore ?? -1) - (a.totalScore ?? -1) || a.name.localeCompare(b.name));
  }

  async createSupplier(data: CreateSupplierDto) {
    if (this.isLocalDemo()) {
      const id = Math.max(...this.DEMO_SUPPLIERS.map((supplier) => supplier.id)) + 1;
      const supplier = {
        id,
        name: data.name,
        category: data.category,
        productBrand: data.productBrand ?? '-',
        contactPerson: data.contactPerson ?? '-',
        phone: data.phone ?? '-',
        address: data.address ?? '-',
        priceScore: data.priceScore,
        qualityScore: data.qualityScore,
        deliveryScore: data.deliveryScore,
        serviceScore: data.serviceScore,
        capacityScore: data.capacityScore,
        shippingCoverage: data.shippingCoverage ?? 'BUYER_COVERS',
        status: data.status ?? 'ACTIVE',
        notes: data.notes ?? '',
        totalScore: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.DEMO_SUPPLIERS.push(supplier);
      this.demoAddedSupplierIds.add(id);
      return {
        ...supplier,
      };
    }

    return this.prisma.supplier.create({
      data: this.supplierPayload(data),
    });
  }

  async updateSupplier(id: number, data: UpdateSupplierDto) {
    if (this.isLocalDemo()) {
      const existing = this.DEMO_SUPPLIERS.find((supplier) => supplier.id === id);
      if (!existing) throw new NotFoundException('Supplier not found');
      Object.assign(existing, data, { totalScore: null, updatedAt: new Date() });
      return { ...existing };
    }

    const existing = await this.prisma.supplier.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Supplier not found');

    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...data,
        totalScore: null,
      },
    });
  }

  async deleteSupplier(id: number) {
    if (this.isLocalDemo()) {
      const index = this.DEMO_SUPPLIERS.findIndex((supplier) => supplier.id === id);
      if (index === -1) throw new NotFoundException('Supplier not found');
      if (this.demoAddedSupplierIds.has(id)) {
        this.DEMO_SUPPLIERS.splice(index, 1);
        this.demoAddedSupplierIds.delete(id);
      }
      return { id };
    }

    const existing = await this.prisma.supplier.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Supplier not found');
    await this.prisma.supplier.delete({ where: { id } });
    return { id };
  }

  async supplierSelection(category?: string, threshold = 0.75, productBrand?: string) {
    if (this.isLocalDemo()) {
      const suppliers = this.DEMO_SUPPLIERS
        .filter((supplier) => this.isDemoSupplierVisible(supplier.id))
        .filter((supplier) => supplier.status === 'ACTIVE' || supplier.status === 'RECOMMENDED')
        .filter((supplier) => !category || supplier.category.toLowerCase().includes(category.toLowerCase()))
        .filter((supplier) => !productBrand || supplier.productBrand.toLowerCase().includes(productBrand.toLowerCase()));

      if (suppliers.length === 0) {
        return { threshold, weights: this.WEIGHTS, criterionType: { price: 'cost', quality: 'benefit', delivery: 'benefit', service: 'benefit', capacity: 'benefit' }, suppliers: [] };
      }

      const raw = suppliers.map((s) => ({
        id: s.id,
        price: Number(s.priceScore) / 10,
        quality: Number(s.qualityScore) / 10,
        delivery: Number(s.deliveryScore) / 10,
        service: Number(s.serviceScore) / 10,
        capacity: Number(s.capacityScore) / 10,
      }));

      const minPrice = Math.min(...raw.map((r) => r.price));
      const maxValues = {
        quality: Math.max(...raw.map((r) => r.quality)),
        delivery: Math.max(...raw.map((r) => r.delivery)),
        service: Math.max(...raw.map((r) => r.service)),
        capacity: Math.max(...raw.map((r) => r.capacity)),
      };

      const results = suppliers
        .map((supplier, i) => {
          const calc = this.sawNormalizeAndScore(
            raw[i],
            minPrice,
            maxValues,
            supplier.shippingCoverage === 'SUPPLIER_COVERS',
          );
          return {
            supplierId: supplier.id,
            name: supplier.name,
            category: supplier.category,
            productBrand: supplier.productBrand,
            contactPerson: supplier.contactPerson,
            phone: supplier.phone,
            priceScore: Number(supplier.priceScore),
            qualityScore: Number(supplier.qualityScore),
            deliveryScore: Number(supplier.deliveryScore),
            serviceScore: Number(supplier.serviceScore),
            capacityScore: Number(supplier.capacityScore),
            normalizedPrice: calc.normalized.price,
            normalizedQuality: calc.normalized.quality,
            normalizedDelivery: calc.normalized.delivery,
            normalizedService: calc.normalized.service,
            normalizedCapacity: calc.normalized.capacity,
            shippingCoverage: supplier.shippingCoverage,
            bonus: calc.bonus,
            totalScore: calc.total,
            recommended: calc.total >= threshold,
            rank: 0,
          };
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((supplier, index) => ({
          ...supplier,
          rank: index + 1,
          resultId: supplier.supplierId,
          status: this.demoResultStatus.get(supplier.supplierId) ?? 'PENDING',
        }));

      return {
        threshold,
        weights: this.WEIGHTS,
        criterionType: { price: 'cost', quality: 'benefit', delivery: 'benefit', service: 'benefit', capacity: 'benefit' },
        suppliers: results,
      };
    }

    const suppliers = await this.prisma.supplier.findMany({
      where: {
        status: { in: ['ACTIVE', 'RECOMMENDED'] },
        ...(category ? { category: { contains: category, mode: 'insensitive' as const } } : {}),
        ...(productBrand ? { productBrand: { contains: productBrand, mode: 'insensitive' as const } } : {}),
      },
    });

    if (suppliers.length === 0) {
      return { threshold, weights: this.WEIGHTS, criterionType: { ...this.COST_CRITERIA.reduce((a, c) => ({ ...a, [c]: 'cost' }), {}), ...this.BENEFIT_CRITERIA.reduce((a, c) => ({ ...a, [c]: 'benefit' }), {}) }, suppliers: [] };
    }

    const raw = suppliers.map((s) => ({
      id: s.id,
      price: Number(s.priceScore) / 10,
      quality: Number(s.qualityScore) / 10,
      delivery: Number(s.deliveryScore) / 10,
      service: Number(s.serviceScore) / 10,
      capacity: Number(s.capacityScore) / 10,
    }));

    const minPrice = Math.min(...raw.map((r) => r.price));
    const maxValues = {
      quality: Math.max(...raw.map((r) => r.quality)),
      delivery: Math.max(...raw.map((r) => r.delivery)),
      service: Math.max(...raw.map((r) => r.service)),
      capacity: Math.max(...raw.map((r) => r.capacity)),
    };

    const results = suppliers
      .map((supplier, i) => {
        const r = raw[i];
        const calc = this.sawNormalizeAndScore(
          r,
          minPrice,
          maxValues,
          supplier.shippingCoverage === 'SUPPLIER_COVERS',
        );

        return {
          supplierId: supplier.id,
          name: supplier.name,
          category: supplier.category,
          productBrand: supplier.productBrand,
          contactPerson: supplier.contactPerson,
          phone: supplier.phone,
          priceScore: Number(supplier.priceScore),
          qualityScore: Number(supplier.qualityScore),
          deliveryScore: Number(supplier.deliveryScore),
          serviceScore: Number(supplier.serviceScore),
          capacityScore: Number(supplier.capacityScore),
          normalizedPrice: Math.round(calc.normalized.price * 10000) / 10000,
          normalizedQuality: Math.round(calc.normalized.quality * 10000) / 10000,
          normalizedDelivery: Math.round(calc.normalized.delivery * 10000) / 10000,
          normalizedService: Math.round(calc.normalized.service * 10000) / 10000,
          normalizedCapacity: Math.round(calc.normalized.capacity * 10000) / 10000,
          shippingCoverage: supplier.shippingCoverage,
          bonus: calc.bonus,
          totalScore: calc.total,
          recommended: calc.total >= threshold,
          rank: 0,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((supplier, index) => ({ ...supplier, rank: index + 1 }));

    const existing = await this.prisma.spkResult.findMany({
      where: { type: 'SUPPLIER_SELECTION' },
    });
    const existingMap = new Map(existing.map((item) => [item.referenceId, item]));

    for (const result of results) {
      const prev = existingMap.get(result.supplierId);
      if (prev) {
        const prevDetails = prev.details as Record<string, unknown> | null;
        await this.prisma.spkResult.update({
          where: { id: prev.id },
          data: {
            score: result.totalScore,
            rank: result.rank,
            details: { ...result, status: prevDetails?.status ?? 'PENDING' } as any,
          },
        });
      } else {
        const created = await this.prisma.spkResult.create({
          data: {
            type: 'SUPPLIER_SELECTION',
            referenceId: result.supplierId,
            score: result.totalScore,
            rank: result.rank,
            details: { ...result, status: 'PENDING' } as any,
          },
        });
        existingMap.set(result.supplierId, created);
      }
    }

    await this.prisma.$transaction(
      results.map((result) =>
        this.prisma.supplier.update({
          where: { id: result.supplierId },
          data: { totalScore: result.totalScore },
        }),
      ),
    );

    const suppliersWithResultId = results.map((result) => {
      const saved = existingMap.get(result.supplierId);
      const status = saved ? ((saved.details as Record<string, unknown>)?.status as string) ?? 'PENDING' : 'PENDING';
      return { ...result, resultId: saved?.id, status };
    });

    const criterionType = {
      price: 'cost',
      quality: 'benefit',
      delivery: 'benefit',
      service: 'benefit',
      capacity: 'benefit',
    };

    return {
      threshold,
      weights: this.WEIGHTS,
      criterionType,
      suppliers: suppliersWithResultId,
    };
  }

  async earlyWarnings() {
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const sixtyDays = new Date(now);
    sixtyDays.setDate(sixtyDays.getDate() + 60);
    const twoYearsAgo = new Date(now);
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const [decliningPerformance, contractExpiring, noRaiseLongTerm, highAbsence] = await Promise.all([
      this.prisma.performance.findMany({
        where: { period: { gte: threeMonthsAgo.toISOString().slice(0, 7) }, totalScore: { lt: 50 } },
        include: { employee: { select: { id: true, name: true, nik: true } } },
      }),
      this.prisma.employee.findMany({
        where: { status: 'ACTIVE', contractEnd: { lte: sixtyDays, gte: now } },
        select: { id: true, name: true, nik: true, contractEnd: true },
      }),
      this.prisma.employee.findMany({
        where: { status: 'ACTIVE', joinDate: { lte: twoYearsAgo } },
        select: { id: true, name: true, nik: true, joinDate: true },
      }),
      this.prisma.attendance.findMany({
        where: { date: { gte: threeMonthsAgo }, status: 'ALPHA' },
        include: { employee: { select: { id: true, name: true } } },
      }),
    ]);

    return {
      decliningPerformance: decliningPerformance.map((p) => ({ employee: p.employee, score: p.totalScore, period: p.period })),
      contractExpiring,
      noRaiseLongTerm: noRaiseLongTerm.map((e) => ({ employee: e, joinDate: e.joinDate })),
      highAbsence: highAbsence.map((a) => ({ employee: a.employee, date: a.date })),
    };
  }

  async getResults(type?: string) {
    if (this.isLocalDemo()) {
      return [];
    }

    return this.prisma.spkResult.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
