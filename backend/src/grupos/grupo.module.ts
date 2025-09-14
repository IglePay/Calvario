import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
@Module({
    imports: [AuthModule],
    controllers: [GrupoController],
    providers: [GrupoService, PrismaService],
    exports: [GrupoService],
})
export class GrupoModule {}
