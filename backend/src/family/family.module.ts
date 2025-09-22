import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [FamilyController],
    providers: [FamilyService, PrismaService],
    exports: [FamilyService],
})
export class FamilyModule {}
