import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany({
            include: {
                role: true,
                tb_tenants: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                tb_tenants: true,
            },
        });
    }

    async findTenants() {
        return this.prisma.tb_tenants.findMany({
            select: { id_tenant: true, nombre: true },
        });
    }

    async findRoles() {
        return this.prisma.role.findMany({
            select: { id: true, nombre: true }, // ✅ id y nombre, no id_rol
        });
    }

    async createUser(data: {
        name: string;
        email: string;
        password: string;
        roleId: number;
        tenantId: number;
    }) {
        const tenant = await this.prisma.tb_tenants.findUnique({
            where: { id_tenant: data.tenantId },
        });
        if (!tenant) throw new Error('Tenant no válido');

        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: { connect: { id: data.roleId } },
                tb_tenants: { connect: { id_tenant: data.tenantId } },
            },
        });
    }

    async updateUser(
        id: number,
        data: {
            name?: string;
            email?: string;
            password?: string;
            roleId?: number;
            tenantId?: number;
        },
    ) {
        const updateData: any = {};

        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;

        // Si envían contraseña, la encriptamos
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        // Conectar rol si se envía
        if (data.roleId) {
            // Validar que el rol existe
            const role = await this.prisma.role.findUnique({
                where: { id: data.roleId },
            });
            if (!role) throw new Error('Rol no válido');
            updateData.role = { connect: { id: data.roleId } };
        }

        // Conectar tenant/iglesia si se envía
        if (data.tenantId) {
            // Validar que el tenant existe
            const tenant = await this.prisma.tb_tenants.findUnique({
                where: { id_tenant: data.tenantId },
            });
            if (!tenant) throw new Error('Tenant no válido');
            updateData.tb_tenants = { connect: { id_tenant: data.tenantId } };
        }

        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }

    async deleteUser(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    // para  la tabla user
    async findAllWithDetails() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true, // nombre del usuario
                email: true,
                password: true, // contrasena
                role: { select: { nombre: true } }, // rol
                tb_tenants: { select: { nombre: true } }, // iglesia
            },
        });
    }
}
