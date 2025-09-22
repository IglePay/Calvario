import { Global, Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TenantsModule } from './tenants/tenants.module';
import { GeneroModule } from './genero/genero.module';
import { EstadoCivilModule } from './estado-civil/estado-civil.module';
import { GrupoModule } from './grupos/grupo.module';
import { MiembrosModule } from './miembros/miembros.module';
import { LimpiezaModule } from './limpieza/limpieza.module';
import { ActividadModule } from './actividades/actividad.module';
import { ColaboradorModule } from './colaborador/colaborador.module';
import { FamilyModule } from './family/family.module';

@Global()
@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        AuthModule,
        UsersModule,
        RolesModule,
        TenantsModule,
        GeneroModule,
        EstadoCivilModule,
        GrupoModule,
        MiembrosModule,
        LimpiezaModule,
        ActividadModule,
        ColaboradorModule,
        FamilyModule,
    ],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule {}
