import { Module } from '@nestjs/common';
import { GeneroService } from './genero.service';
import { GeneroController } from './genero.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [GeneroController],
    providers: [GeneroService, PrismaService],
    exports: [GeneroService],
})
export class GeneroModule {}
