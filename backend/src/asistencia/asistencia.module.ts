import { Module } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [AsistenciaController],
    providers: [AsistenciaService, PrismaService],
    exports: [AsistenciaService],
})
export class AsistenciaModule {}
