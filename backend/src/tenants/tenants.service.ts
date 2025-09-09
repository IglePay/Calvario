import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TenantsService {
    constructor(private prisma: PrismaService) {}

    // Obtener todos los tenants
    async findAll() {
        return this.prisma.tb_tenants.findMany();
    }

    // Obtener tenant por id
    async findOneById(id: number) {
        return this.prisma.tb_tenants.findUnique({
            where: { id_tenant: id },
        });
    }

    // Crear nuevo tenant
    async create(data: {
        dpi: string;
        nombre: string;
        email: string;
        telefono?: string;
        fecha_inicio?: Date;
        direccion?: string;
    }) {
        return this.prisma.tb_tenants.create({ data });
    }

    // Actualizar tenant
    async update(id: number, data: any) {
        return this.prisma.tb_tenants.update({
            where: { id_tenant: id },
            data,
        });
    }

    // Eliminar tenant
    async remove(id: number) {
        return this.prisma.tb_tenants.delete({
            where: { id_tenant: id },
        });
    }
}
