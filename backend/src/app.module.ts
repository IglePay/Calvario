import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TenantsModule } from './tenants/tenants.module';
import { GeneroModule } from './genero/genero.module';
import { EstadoCivilModule } from './estado-civil/estado-civil.module';
import { GrupoModule } from './grupos/grupo.module';

@Global()
@Module({
    imports: [
        AuthModule,
        UsersModule,
        RolesModule,
        TenantsModule,
        GeneroModule,
        EstadoCivilModule,
        GrupoModule,
    ],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule {}
