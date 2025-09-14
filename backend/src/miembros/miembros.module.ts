import { Module } from '@nestjs/common';
import { MiembrosService } from './miembros.service';
import { MiembrosController } from './miembros.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [MiembrosController],
    providers: [MiembrosService, PrismaService],
    exports: [MiembrosService],
})
export class MiembrosModule {}
