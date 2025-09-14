import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantsService {
    constructor(private prisma: PrismaService) {}

    // Obtener todos los tenants
    async findAll() {
        const tenants = await this.prisma.tb_tenants.findMany();
        return tenants.map((t) => ({
            ...t,
            fecha_inicio: t.fecha_inicio
                ? t.fecha_inicio.toISOString().split('T')[0]
                : null,
        }));
    }

    // Obtener tenant por id
    async findOneById(id: number) {
        return this.prisma.tb_tenants.findUnique({
            where: { id_tenant: id },
        });
    }

    async create(data: CreateTenantDto) {
        const prismaData = {
            ...data,
            fecha_inicio: data.fecha_inicio
                ? new Date(data.fecha_inicio)
                : undefined,
        };

        return this.prisma.tb_tenants.create({ data: prismaData });
    }

    async update(id: number, data: UpdateTenantDto) {
        const prismaData = {
            ...data,
            // Convertimos a Date solo para Prisma
            fecha_inicio: data.fecha_inicio
                ? new Date(data.fecha_inicio)
                : undefined,
        };

        return this.prisma.tb_tenants.update({
            where: { id_tenant: id },
            data: prismaData,
        });
    }

    // Eliminar tenant
    async remove(id: number) {
        return this.prisma.tb_tenants.delete({
            where: { id_tenant: id },
        });
    }
}
