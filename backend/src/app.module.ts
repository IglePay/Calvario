import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TenantsModule } from './tenants/tenants.module';

@Global()
@Module({
    imports: [AuthModule, UsersModule, RolesModule, TenantsModule],
    controllers: [],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule {}
