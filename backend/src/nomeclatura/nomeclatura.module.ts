import { Module } from '@nestjs/common';
import { NomeclaturaService } from './nomeclatura.service';
import { NomeclaturaController } from './nomeclatura.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [NomeclaturaController],
    providers: [NomeclaturaService],
    exports: [NomeclaturaService],
})
export class NomeclaturaModule {}
