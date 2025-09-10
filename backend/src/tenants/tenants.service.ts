import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

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
        const { id_tenant, fecha_creacion, ...updateData } = data; // Excluir id_tenant de los datos a actualizar

        if (
            updateData.fecha_inicio &&
            typeof updateData.fecha_inicio === 'string'
        ) {
            updateData.fecha_inicio = new Date(updateData.fecha_inicio);
        }

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
