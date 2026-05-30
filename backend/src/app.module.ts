import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { TransformInterceptor } from './common/interceptors/transform.interceptor';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeavesModule } from './leaves/leaves.module';
import { PayrollModule } from './payroll/payroll.module';
import { PerformanceModule } from './performance/performance.module';
import { TrainingModule } from './training/training.module';
import { SkillsModule } from './skills/skills.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { SpkModule } from './spk/spk.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    UsersModule,
    DepartmentsModule,
    PositionsModule,
    EmployeesModule,
    AttendanceModule,
    LeavesModule,
    PayrollModule,
    PerformanceModule,
    TrainingModule,
    SkillsModule,
    RecruitmentModule,
    SpkModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
