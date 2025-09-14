import { Module } from '@nestjs/common';
import { EstadoCivilService } from './estado-civil.service';
import { EstadoCivilController } from './estado-civil.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
@Module({
    imports: [AuthModule],
    controllers: [EstadoCivilController],
    providers: [EstadoCivilService, PrismaService],
    exports: [EstadoCivilService],
})
export class EstadoCivilModule {}
