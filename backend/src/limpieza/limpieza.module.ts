import { Module } from '@nestjs/common';
import { LimpiezaService } from './limpieza.service';
import { LimpiezaController } from './limpieza.controller';
import { PrismaService } from '../../prisma/prisma.service';
@Module({
    controllers: [LimpiezaController],
    providers: [LimpiezaService, PrismaService],
    exports: [LimpiezaService],
})
export class LimpiezaModule {}
