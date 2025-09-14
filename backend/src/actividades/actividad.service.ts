import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActividadService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        const actividades = await this.prisma.tb_actividad.findMany({
            select: {
                idActividad: true,
                titulo: true,
                descripcion: true,
                fechaActividad: true,
                miembro: {
                    select: {
                        nombre: true,
                        apellido: true,
                    },
                },
                grupo: {
                    select: {
                        nombregrupo: true,
                    },
                },
            },
        });

        return actividades.map((a) => ({
            idActividad: a.idActividad,
            titulo: a.titulo,
            descripcion: a.descripcion,
            fechaActividad: a.fechaActividad.toISOString().split('T')[0], // "YYYY-MM-DD"
            miembro: a.miembro
                ? `${a.miembro.nombre} ${a.miembro.apellido}`
                : null,
            grupo: a.grupo ? a.grupo.nombregrupo : null,
        }));
    }

    findAllMiembros() {
        return this.prisma.tb_miembros.findMany({
            select: { idMiembro: true, nombre: true, apellido: true },
        });
    }

    findAllGrupos() {
        return this.prisma.tb_grupo.findMany({
            select: { idGrupo: true, nombregrupo: true },
        });
    }

    findOne(id: number) {
        return this.prisma.tb_actividad.findUnique({
            where: { idActividad: id },
        });
    }

    create(data: any) {
        return this.prisma.tb_actividad.create({
            data: {
                titulo: data.titulo,
                descripcion: data.descripcion || null,
                fechaActividad: new Date(data.fechaActividad),
                idMiembro: data.idMiembro, // llave foránea direct
                idGrupo: data.idGrupo || null,
                idTenant: data.idTenant, // llave foránea directa
            },
        });
    }

    update(id: number, data: any) {
        return this.prisma.tb_actividad.update({
            where: { idActividad: id },
            data: {
                titulo: data.titulo,
                descripcion: data.descripcion || null,
                fechaActividad: data.fechaActividad
                    ? new Date(data.fechaActividad)
                    : undefined,
                idMiembro: data.idMiembro,
                idGrupo: data.idGrupo ?? null,
            },
        });
    }

    remove(id: number) {
        return this.prisma.tb_actividad.delete({ where: { idActividad: id } });
    }
}
