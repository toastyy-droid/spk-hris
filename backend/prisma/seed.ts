import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);

  await prisma.spkResult.deleteMany({});
  await prisma.skillMatrix.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.training.deleteMany({});
  await prisma.performance.deleteMany({});
  await prisma.payroll.deleteMany({});
  await prisma.leave.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.recruitment.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.position.deleteMany({});
  await prisma.department.deleteMany({});

  const deptHR = await prisma.department.create({ data: { name: 'Human Resources', code: 'HR' } });
  const deptIT = await prisma.department.create({ data: { name: 'Information Technology', code: 'IT' } });
  const deptFinance = await prisma.department.create({ data: { name: 'Finance & Accounting', code: 'FIN' } });
  const deptMarketing = await prisma.department.create({ data: { name: 'Marketing', code: 'MKT' } });
  const deptOps = await prisma.department.create({ data: { name: 'Operations', code: 'OPS' } });

  const posHRStaff = await prisma.position.create({ data: { name: 'HR Staff', level: 'STAFF', departmentId: deptHR.id } });
  const posHRMgr = await prisma.position.create({ data: { name: 'HR Manager', level: 'MANAGER', departmentId: deptHR.id } });
  const posDev = await prisma.position.create({ data: { name: 'Developer', level: 'STAFF', departmentId: deptIT.id } });
  const posITMgr = await prisma.position.create({ data: { name: 'IT Manager', level: 'MANAGER', departmentId: deptIT.id } });
  const posAcc = await prisma.position.create({ data: { name: 'Accountant', level: 'STAFF', departmentId: deptFinance.id } });
  const posFinMgr = await prisma.position.create({ data: { name: 'Finance Manager', level: 'MANAGER', departmentId: deptFinance.id } });
  const posMktStaff = await prisma.position.create({ data: { name: 'Marketing Staff', level: 'STAFF', departmentId: deptMarketing.id } });
  const posOpsStaff = await prisma.position.create({ data: { name: 'Operations Staff', level: 'STAFF', departmentId: deptOps.id } });

  const employees = [
    { nik: '19800101', name: 'Admin HR', email: 'admin@hris-amm.com', phone: '08123456789', deptId: deptHR.id, posId: posHRStaff.id, gender: 'Laki-laki', religion: 'Islam', education: 'S1', birthDate: new Date('1980-01-01'), joinDate: new Date('2020-01-01'), status: 'ACTIVE' as const, role: UserRole.ADMIN_HR },
    { nik: '19900101', name: 'Budi Santoso', email: 'budi@hris-amm.com', phone: '08123456780', deptId: deptIT.id, posId: posDev.id, gender: 'Laki-laki', religion: 'Islam', education: 'S1', birthDate: new Date('1990-01-01'), joinDate: new Date('2021-03-15'), status: 'ACTIVE' as const, role: UserRole.KARYAWAN },
    { nik: '19910202', name: 'Siti Rahmawati', email: 'siti@hris-amm.com', phone: '08123456781', deptId: deptIT.id, posId: posDev.id, gender: 'Perempuan', religion: 'Islam', education: 'S1', birthDate: new Date('1991-02-02'), joinDate: new Date('2022-06-01'), status: 'ACTIVE' as const, role: UserRole.KARYAWAN },
    { nik: '19920303', name: 'Ahmad Hidayat', email: 'ahmad@hris-amm.com', phone: '08123456782', deptId: deptFinance.id, posId: posAcc.id, gender: 'Laki-laki', religion: 'Islam', education: 'D3', birthDate: new Date('1992-03-03'), joinDate: new Date('2021-08-20'), status: 'ACTIVE' as const, role: UserRole.KARYAWAN },
    { nik: '19930404', name: 'Dewi Lestari', email: 'dewi@hris-amm.com', phone: '08123456783', deptId: deptMarketing.id, posId: posMktStaff.id, gender: 'Perempuan', religion: 'Kristen', education: 'S1', birthDate: new Date('1993-04-04'), joinDate: new Date('2023-01-10'), status: 'PROBATION' as const, role: UserRole.KARYAWAN },
    { nik: '19940505', name: 'Rudi Hartono', email: 'rudi@hris-amm.com', phone: '08123456784', deptId: deptOps.id, posId: posOpsStaff.id, gender: 'Laki-laki', religion: 'Islam', education: 'SMA', birthDate: new Date('1994-05-05'), joinDate: new Date('2019-11-01'), status: 'ACTIVE' as const, role: UserRole.KARYAWAN },
    { nik: '19950606', name: 'Maya Anggraini', email: 'maya@hris-amm.com', phone: '08123456785', deptId: deptHR.id, posId: posHRStaff.id, gender: 'Perempuan', religion: 'Islam', education: 'S1', birthDate: new Date('1995-06-06'), joinDate: new Date('2022-09-01'), status: 'ACTIVE' as const, role: UserRole.KARYAWAN },
    { nik: '19960707', name: 'Dimas Pratama', email: 'dimas@hris-amm.com', phone: '08123456786', deptId: deptIT.id, posId: posDev.id, gender: 'Laki-laki', religion: 'Kristen', education: 'S1', birthDate: new Date('1996-07-07'), joinDate: new Date('2023-06-15'), status: 'PROBATION' as const, role: UserRole.KARYAWAN },
  ];

  const createdEmployees: { id: number; userId: number; name: string; deptId: number }[] = [];

  for (const emp of employees) {
    const created = await prisma.employee.create({
      data: {
        nik: emp.nik,
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        gender: emp.gender,
        religion: emp.religion,
        education: emp.education,
        birthDate: emp.birthDate,
        joinDate: emp.joinDate,
        status: emp.status,
        departmentId: emp.deptId,
        positionId: emp.posId,
      },
    });

    const user = await prisma.user.create({
      data: {
        username: emp.nik,
        password: hashed,
        role: emp.role,
        employee: { connect: { id: created.id } },
      },
    });

    createdEmployees.push({ id: created.id, userId: user.id, name: emp.name, deptId: emp.deptId });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 20; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    for (const emp of createdEmployees) {
      if (dayOffset === 0 && emp.name === 'Admin HR') continue;
      const hadir = Math.random() > 0.15;
      if (!hadir) continue;

      const checkInHour = 7 + Math.floor(Math.random() * 2);
      const checkInMin = Math.floor(Math.random() * 60);
      const checkOutHour = 16 + Math.floor(Math.random() * 2);
      const checkOutMin = Math.floor(Math.random() * 60);

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          date,
          checkIn: new Date(date.getFullYear(), date.getMonth(), date.getDate(), checkInHour, checkInMin),
          checkOut: new Date(date.getFullYear(), date.getMonth(), date.getDate(), checkOutHour, checkOutMin),
          status: 'HADIR',
        },
      });
    }
  }

  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  for (const emp of createdEmployees) {
    await prisma.payroll.create({
      data: {
        employeeId: emp.id,
        periodMonth: currentMonth,
        periodYear: currentYear,
        basicSalary: 5000000,
        allowanceTransport: 500000,
        allowanceMeal: 300000,
        allowanceHealth: 200000,
        deductionBpjsTk: 50000,
        deductionBpjsKes: 100000,
        deductionPph21: 25000,
        netSalary: 5825000,
        status: 'DRAFT',
      },
    });
  }

  const periods = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
  for (const emp of createdEmployees) {
    for (const period of periods) {
      const kpiScore = 60 + Math.floor(Math.random() * 40);
      const selfScore = 65 + Math.floor(Math.random() * 35);
      const review360Score = 60 + Math.floor(Math.random() * 40);
      const totalScore = Math.round(kpiScore * 0.4 + selfScore * 0.2 + review360Score * 0.4);
      const grade = totalScore >= 85 ? 'A' : totalScore >= 70 ? 'B' : totalScore >= 55 ? 'C' : 'D';

      await prisma.performance.create({
        data: {
          employeeId: emp.id,
          period,
          kpiScore,
          selfScore,
          review360Score,
          totalScore,
          grade,
        },
      });
    }
  }

  await prisma.leave.createMany({
    data: [
      { employeeId: createdEmployees[1].id, type: 'TAHUNAN', startDate: new Date('2026-05-20'), endDate: new Date('2026-05-22'), status: 'PENDING', reason: 'Liburan keluarga' },
      { employeeId: createdEmployees[2].id, type: 'SAKIT', startDate: new Date('2026-05-15'), endDate: new Date('2026-05-16'), status: 'APPROVED', reason: 'Sakit demam', approvedBy: createdEmployees[0].id },
      { employeeId: createdEmployees[4].id, type: 'PENTING', startDate: new Date('2026-05-25'), endDate: new Date('2026-05-25'), status: 'PENDING', reason: 'Acara keluarga' },
    ],
  });

  const skillNames = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'UI/UX Design', 'Digital Marketing', 'Financial Analysis', 'Project Management'];
  const createdSkills: { id: number; name: string }[] = [];

  for (const name of skillNames) {
    const skill = await prisma.skill.create({ data: { name } });
    createdSkills.push(skill);
  }

  for (const emp of createdEmployees) {
    const numSkills = 2 + Math.floor(Math.random() * 4);
    const shuffled = [...createdSkills].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numSkills; i++) {
      await prisma.skillMatrix.create({
        data: {
          employeeId: emp.id,
          skillId: shuffled[i].id,
          proficiency: 1 + Math.floor(Math.random() * 4),
        },
      });
    }
  }

  await prisma.training.createMany({
    data: [
      { employeeId: createdEmployees[1].id, name: 'Advanced React Workshop', provider: 'Online Course', date: new Date('2026-04-10'), cost: 1500000, duration: 16, notes: 'React 19 features' },
      { employeeId: createdEmployees[2].id, name: 'Node.js Performance', provider: 'TechTrain', date: new Date('2026-03-20'), cost: 2000000, duration: 24, notes: 'Microservices architecture' },
      { employeeId: createdEmployees[3].id, name: 'Financial Reporting Standards', provider: 'ICAI', date: new Date('2026-02-15'), cost: 3000000, duration: 32, notes: 'PSAK update 2026' },
    ],
  });

  await prisma.recruitment.createMany({
    data: [
      { positionId: posDev.id, candidateName: 'Andi Wijaya', email: 'andi@email.com', phone: '0811111111', stage: 'SCREENING', scoreExperience: 75, scoreEducation: 80, scoreInterview: 0, scoreSoftskill: 70, scoreSalary: 65, totalScore: 0 },
      { positionId: posHRStaff.id, candidateName: 'Rina Marlina', email: 'rina@email.com', phone: '0812222222', stage: 'INTERVIEW', scoreExperience: 70, scoreEducation: 85, scoreInterview: 78, scoreSoftskill: 80, scoreSalary: 60, totalScore: 74.5 },
      { positionId: posMktStaff.id, candidateName: 'Toni Gunawan', email: 'toni@email.com', phone: '0813333333', stage: 'OFFERING', scoreExperience: 80, scoreEducation: 75, scoreInterview: 82, scoreSoftskill: 85, scoreSalary: 70, totalScore: 79.5 },
    ],
  });

  await prisma.spkResult.create({
    data: {
      type: 'PROMOTION',
      details: JSON.stringify({
        candidates: createdEmployees.slice(0, 5).map((emp, i) => ({
          name: emp.name,
          score: 85 - i * 5,
          criteria: { performance: 80 - i * 5, tenure: 90 - i * 3, skillMatch: 75 - i * 10, discipline: 80, review360: 80 - i * 5 },
        })),
      }),
      score: 85,
    },
  });

  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashed,
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log(`Seed complete: ${createdEmployees.length} employees created`);
  console.log('Admin login: admin / admin123 (SUPER_ADMIN)');
  console.log('Employee login: <nik> / admin123 (role sesuai data)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
