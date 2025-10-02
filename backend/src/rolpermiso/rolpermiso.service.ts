import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolPermisoService {
    constructor(private prisma: PrismaService) {}

    // Crear un permiso nuevo
    async createPermiso(nombre: string, descripcion: string) {
        return this.prisma.tb_permission.create({
            data: { nombre, descripcion },
        });
    }

    // Asignar un permiso a un rol
    async assignPermisoToRol(roleId: number, permisoId: number) {
        return this.prisma.tb_role_permissions.create({
            data: {
                role_id: roleId,
                permission_id: permisoId,
            },
        });
    }

    //tabla con rol y sus permisos
    async getAllRolesWithPermisos(params: {
        page: number;
        limit: number;
        search?: string;
    }) {
        const { page, limit, search } = params;

        const where = search ? { nombre: { contains: search } } : {};

        const [roles, total] = await this.prisma.$transaction([
            this.prisma.tb_role.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where,
                orderBy: { id: 'asc' },
                include: {
                    rolePermissions: {
                        // <-- usar 'rolePermissions'
                        include: { permiso: true }, // <-- usar 'permiso'
                    },
                },
            }),
            this.prisma.tb_role.count({ where }),
        ]);

        // Transformar la data para frontend: permisos como array plano
        const data = roles.map((role) => ({
            id: role.id,
            nombre: role.nombre,
            descripcion: role.descripcion,
            permisos: role.rolePermissions.map((rp) => rp.permiso), // <-- usar 'permiso'
        }));

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // rolpermiso para    la tabla
    async getAllRoles(params: {
        page: number;
        limit: number;
        search?: string;
    }) {
        const { page, limit, search } = params;

        const where = search
            ? {
                  nombre: {
                      contains: search, // sin mode
                  },
              }
            : {};

        const [roles, total] = await this.prisma.$transaction([
            this.prisma.tb_role.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where,
                select: {
                    id: true,
                    nombre: true,
                    descripcion: true,
                },
                orderBy: { id: 'asc' },
            }),
            this.prisma.tb_role.count({ where }),
        ]);

        return {
            data: roles,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Actualizar todos los permisos de un rol (frontend envía array de nombres)
    async updatePermisosRol(roleId: number, nombresPermisos: string[]) {
        // Primero borramos todos los permisos existentes del rol
        await this.prisma.tb_role_permissions.deleteMany({
            where: { role_id: roleId },
        });

        if (!nombresPermisos || nombresPermisos.length === 0) {
            return [];
        }

        // Buscamos los permisos por nombre
        const permisos = await this.prisma.tb_permission.findMany({
            where: { nombre: { in: nombresPermisos } },
        });

        // Creamos nuevas relaciones
        const data = permisos.map((p) => ({
            role_id: roleId,
            permission_id: p.id,
        }));

        if (data.length === 0) return [];
        return this.prisma.tb_role_permissions.createMany({ data });
    }

    // Listar todos los permisos disponibles
    async getAllPermisos() {
        return this.prisma.tb_permission.findMany();
    }
}
