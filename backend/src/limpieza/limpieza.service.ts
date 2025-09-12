import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LimpiezaService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.tb_limpieza.findMany({
            select: {
                idLimpieza: true,
                fechaLimpieza: true,
                miembro: {
                    select: {
                        idMiembro: true,
                        nombre: true,
                        apellido: true,
                        genero: {
                            select: {
                                idGenero: true,
                                nombregenero: true,
                            },
                        },
                    },
                },
                tenant: {
                    select: {
                        id_tenant: true,
                        nombre: true,
                    },
                },
            },
        });
    }

    async findOne(id: number) {
        return this.prisma.tb_limpieza.findUnique({
            where: { idLimpieza: id },
            select: {
                idLimpieza: true,
                fechaLimpieza: true,
                miembro: {
                    select: { idMiembro: true, nombre: true, apellido: true },
                },
                tenant: {
                    select: { id_tenant: true, nombre: true },
                },
            },
        });
    }

    async create(data: {
        idMiembro: number;
        idTenant: number;
        fechaLimpieza: Date;
    }) {
        // Validar que el miembro existe y pertenece al tenant
        const miembro = await this.prisma.tb_miembros.findFirst({
            where: { idMiembro: data.idMiembro, idTenant: data.idTenant },
        });

        if (!miembro) {
            throw new Error('El miembro no existe o no pertenece al tenant');
        }

        return this.prisma.tb_limpieza.create({ data });
    }

    async update(
        id: number,
        data: { fechaLimpieza?: Date; idMiembro?: number; idTenant: number },
    ) {
        // Validar que la limpieza pertenece al tenant
        const limpieza = await this.prisma.tb_limpieza.findFirst({
            where: { idLimpieza: id, idTenant: data.idTenant },
        });

        if (!limpieza) {
            throw new Error('La limpieza no existe o no pertenece al tenant');
        }

        return this.prisma.tb_limpieza.update({
            where: { idLimpieza: id },
            data,
        });
    }

    async remove(id: number) {
        return this.prisma.tb_limpieza.delete({
            where: { idLimpieza: id },
        });
    }
}
