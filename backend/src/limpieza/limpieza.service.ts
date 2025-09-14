import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LimpiezaService {
    constructor(private prisma: PrismaService) {}

    async findAll(idTenant: number) {
        return this.prisma.tb_limpieza.findMany({
            where: { idTenant },
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

    async findOne(id: number, idTenant: number) {
        return this.prisma.tb_limpieza.findFirst({
            where: { idLimpieza: id, idTenant },
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

    async create(data: {
        idMiembro: number;
        fechaLimpieza: string;
        idTenant: number;
        idGrupo?: number;
    }) {
        // validar miembro
        const miembro = await this.prisma.tb_miembros.findFirst({
            where: { idMiembro: data.idMiembro, idTenant: data.idTenant },
        });
        if (!miembro)
            throw new Error('El miembro no existe o no pertenece al tenant');

        // validar grupo si viene
        if (data.idGrupo) {
            const grupo = await this.prisma.tb_grupo.findFirst({
                where: { idGrupo: data.idGrupo, idTenant: data.idTenant },
            });
            if (!grupo)
                throw new Error('El grupo no existe o no pertenece al tenant');
        }

        return this.prisma.tb_limpieza.create({
            data: {
                idMiembro: data.idMiembro,
                idTenant: data.idTenant,
                fechaLimpieza: new Date(data.fechaLimpieza),
                ...(data.idGrupo && { idGrupo: data.idGrupo }),
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
            where: { idLimpieza: id, idTenant: data.idTenant },
        });
        if (!limpieza)
            throw new Error('La limpieza no existe o no pertenece al tenant');

        // validar nuevo miembro si viene
        if (data.idMiembro) {
            const miembro = await this.prisma.tb_miembros.findFirst({
                where: { idMiembro: data.idMiembro, idTenant: data.idTenant },
            });
            if (!miembro)
                throw new Error(
                    'El miembro no existe o no pertenece al tenant',
                );
        }

        // validar nuevo grupo si viene
        if (data.idGrupo) {
            const grupo = await this.prisma.tb_grupo.findFirst({
                where: { idGrupo: data.idGrupo, idTenant: data.idTenant },
            });
            if (!grupo)
                throw new Error('El grupo no existe o no pertenece al tenant');
        }

        // actualizar solo dentro del tenant
        return this.prisma.tb_limpieza.updateMany({
            where: { idLimpieza: id, idTenant: data.idTenant },
            data: {
                ...(data.idMiembro && { idMiembro: data.idMiembro }),
                ...(data.fechaLimpieza && {
                    fechaLimpieza: new Date(data.fechaLimpieza),
                }),
                ...(data.idGrupo && { idGrupo: data.idGrupo }),
            },
        });
    }

    async remove(id: number, idTenant: number) {
        return this.prisma.tb_limpieza.deleteMany({
            where: { idLimpieza: id, idTenant },
        });
    }

    // async remove(id: number, idTenant: number) {
    //     return this.prisma.tb_limpieza.delete({
    //         where: { idLimpieza_idTenant: { idLimpieza: id, idTenant } }
    //     })
    // }
}
