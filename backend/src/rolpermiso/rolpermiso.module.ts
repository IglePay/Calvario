import { Module } from '@nestjs/common';
import { RolPermisoService } from './rolpermiso.service';
import { RolPermisoController } from './rolpermiso.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    imports: [AuthModule],
    controllers: [RolPermisoController],
    providers: [RolPermisoService, PrismaService],
    exports: [RolPermisoService], // para usarlo en otros módulos si hace falta
})
export class RolPermisoModule {}
