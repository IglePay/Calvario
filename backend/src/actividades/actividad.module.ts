import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ActividadController],
    providers: [ActividadService, PrismaService],
    exports: [ActividadService],
})
export class ActividadModule {}
