import { Module } from '@nestjs/common';
import { LimpiezaService } from './limpieza.service';
import { LimpiezaController } from './limpieza.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
@Module({
    imports: [AuthModule],
    controllers: [LimpiezaController],
    providers: [LimpiezaService, PrismaService],
    exports: [LimpiezaService],
})
export class LimpiezaModule {}
