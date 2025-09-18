import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ColaboradorService {
    constructor(private prisma: PrismaService) {}

    // Obtener colaboradores del tenant del usuario logueado con roles 4,5,6
    async findAll(tenantId: number) {
        return this.prisma.tb_user.findMany({
            where: {
                tenantId,
                roleId: { in: [4, 5, 6] },
            },
            include: { role: true },
        });
    }

    async createUser(
        data: { name: string; email: string; password: string; roleId: number },
        tenantId: number,
    ) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.tb_user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: { connect: { id: data.roleId } },
                tb_tenants: { connect: { id_tenant: tenantId } },
            },
            include: { role: true },
        });
    }

    async updateUser(
        id: number,
        data: {
            name?: string;
            email?: string;
            password?: string;
            roleId?: number;
        },
    ) {
        const updateData: any = {};
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.password)
            updateData.password = await bcrypt.hash(data.password, 10);
        if (data.roleId) updateData.role = { connect: { id: data.roleId } };

        return this.prisma.tb_user.update({
            where: { id },
            data: updateData,
            include: { role: true },
        });
    }

    async deleteUser(id: number) {
        return this.prisma.tb_user.delete({ where: { id } });
    }

    async findRoles() {
        return this.prisma.tb_role.findMany({
            where: { id: { in: [4, 5, 6] } },
            select: { id: true, nombre: true },
        });
    }
}
