import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ScheduleController],
    providers: [ScheduleService, PrismaService],
    exports: [ScheduleService],
})
export class ScheduleModule {}
