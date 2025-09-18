import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LimpiezaService {
    constructor(private prisma: PrismaService) {}

    async findAll(tenantId: number) {
        return this.prisma.tb_limpieza.findMany({
            where: { tenantId },
            select: {
                idLimpieza: true,
                fechaLimpieza: true,
                miembro: {
                    select: {
                        idMiembro: true,
                        nombre: true,
                        apellido: true,
                        genero: {
                            select: { idGenero: true, nombregenero: true },
                        },
                    },
                },
                grupo: { select: { idGrupo: true, nombregrupo: true } },
            },
        });
    }

    async findOne(id: number, tenantId: number) {
        return this.prisma.tb_limpieza.findFirst({
            where: { idLimpieza: id, tenantId },
            select: {
                idLimpieza: true,
                fechaLimpieza: true,
                miembro: {
                    select: {
                        idMiembro: true,
                        nombre: true,
                        apellido: true,
                        genero: {
                            select: { idGenero: true },
                        },
                    },
                },
                grupo: { select: { idGrupo: true, nombregrupo: true } },
            },
        });
    }

    async create(data: {
        idMiembro: number;
        fechaLimpieza: string;
        idTenant: number;
        idGrupo?: number;
    }) {
        // validar miembro
        const miembro = await this.prisma.tb_miembros.findFirst({
            where: { idMiembro: data.idMiembro, tenantId: data.idTenant },
        });
        if (!miembro) {
            throw new Error('El miembro no existe o no pertenece al tenant');
        }

        // validar grupo si viene
        if (data.idGrupo) {
            const grupo = await this.prisma.tb_grupo.findFirst({
                where: { idGrupo: data.idGrupo, tenantId: data.idTenant },
            });
            if (!grupo) {
                throw new Error('El grupo no existe o no pertenece al tenant');
            }
        }

        // crear registro y devolver datos relacionados
        return this.prisma.tb_limpieza.create({
            data: {
                idMiembro: data.idMiembro,
                tenantId: data.idTenant,
                fechaLimpieza: new Date(data.fechaLimpieza),
                ...(data.idGrupo && { idGrupo: data.idGrupo }),
            },
            select: {
                idLimpieza: true,
                fechaLimpieza: true,
                idMiembro: true,
                idGrupo: true,
                miembro: {
                    select: {
                        idMiembro: true,
                        nombre: true,
                        apellido: true,
                        genero: {
                            //  aquí anidamos
                            select: { idGenero: true },
                        },
                    },
                },
                grupo: { select: { idGrupo: true, nombregrupo: true } },
            },
        });
    }

    async update(
        id: number,
        data: {
            idMiembro?: number;
            fechaLimpieza?: string;
            idGrupo?: number;
            idTenant: number;
        },
    ) {
        // validar que la limpieza existe y pertenece al tenant
        const limpieza = await this.prisma.tb_limpieza.findFirst({
            where: { idLimpieza: id, tenantId: data.idTenant },
        });
        if (!limpieza) {
            throw new Error('La limpieza no existe o no pertenece al tenant');
        }

        // validar nuevo miembro si viene
        if (data.idMiembro) {
            const miembro = await this.prisma.tb_miembros.findFirst({
                where: { idMiembro: data.idMiembro, tenantId: data.idTenant },
            });
            if (!miembro) {
                throw new Error(
                    'El miembro no existe o no pertenece al tenant',
                );
            }
        }

        // validar nuevo grupo si viene
        if (data.idGrupo) {
            const grupo = await this.prisma.tb_grupo.findFirst({
                where: { idGrupo: data.idGrupo, tenantId: data.idTenant },
            });
            if (!grupo) {
                throw new Error('El grupo no existe o no pertenece al tenant');
            }
        }

        // actualizar y devolver datos relacionados
        return this.prisma.tb_limpieza.update({
            where: { idLimpieza: id },
            data: {
                ...(data.idMiembro && { idMiembro: data.idMiembro }),
                ...(data.fechaLimpieza && {
                    fechaLimpieza: new Date(data.fechaLimpieza),
                }),
                ...(data.idGrupo && { idGrupo: data.idGrupo }),
            },
            select: {
                idLimpieza: true,
                fechaLimpieza: true,
                idMiembro: true,
                idGrupo: true,
                miembro: {
                    select: {
                        idMiembro: true,
                        nombre: true,
                        apellido: true,
                        genero: {
                            //  incluimos el género
                            select: { idGenero: true, nombregenero: true },
                        },
                    },
                },
                grupo: {
                    select: { idGrupo: true, nombregrupo: true },
                },
            },
        });
    }

    async remove(id: number, tenantId: number) {
        return this.prisma.tb_limpieza.deleteMany({
            where: { idLimpieza: id, tenantId },
        });
    }
}
