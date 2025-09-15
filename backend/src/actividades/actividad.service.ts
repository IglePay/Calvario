import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@Injectable()
export class ActividadService {
    constructor(private prisma: PrismaService) {}

    async findAll(tenantId: number) {
        const actividades = await this.prisma.tb_actividad.findMany({
            where: { idTenant: tenantId },
            select: {
                idActividad: true,
                titulo: true,
                descripcion: true,
                fechaActividad: true,
                miembro: { select: { nombre: true, apellido: true } },
                grupo: { select: { nombregrupo: true } },
            },
        });

        return actividades.map((a) => ({
            idActividad: a.idActividad,
            titulo: a.titulo,
            descripcion: a.descripcion,
            fechaActividad: a.fechaActividad.toISOString().split('T')[0],
            miembro: a.miembro
                ? `${a.miembro.nombre} ${a.miembro.apellido}`
                : null,
            grupo: a.grupo ? a.grupo.nombregrupo : null,
        }));
    }

    findAllMiembros(tenantId: number) {
        return this.prisma.tb_miembros.findMany({
            where: { idTenant: tenantId },
            select: { idMiembro: true, nombre: true, apellido: true },
        });
    }

    findAllGrupos(tenantId: number) {
        return this.prisma.tb_grupo.findMany({
            where: { idTenant: tenantId },
            select: { idGrupo: true, nombregrupo: true },
        });
    }

    async findOne(id: number, tenantId: number) {
        const actividad = await this.prisma.tb_actividad.findUnique({
            where: { idActividad: id },
        });

        if (!actividad) throw new NotFoundException('Actividad no encontrada');
        if (actividad.idTenant !== tenantId)
            throw new ForbiddenException('No autorizado');

        return actividad;
    }

    create(data: CreateActividadDto, tenantId: number) {
        return this.prisma.tb_actividad.create({
            data: {
                ...data,
                fechaActividad: new Date(data.fechaActividad),
                idGrupo: data.idGrupo ?? null,
                idTenant: tenantId,
            },
        });
    }

    async update(id: number, data: UpdateActividadDto, tenantId: number) {
        const actividad = await this.prisma.tb_actividad.findUnique({
            where: { idActividad: id },
        });
        if (!actividad) throw new NotFoundException('Actividad no encontrada');
        if (actividad.idTenant !== tenantId)
            throw new ForbiddenException('No autorizado');

        return this.prisma.tb_actividad.update({
            where: { idActividad: id },
            data: {
                ...data,
                fechaActividad: data.fechaActividad
                    ? new Date(data.fechaActividad)
                    : actividad.fechaActividad,
            },
        });
    }

    async remove(id: number, tenantId: number) {
        const actividad = await this.prisma.tb_actividad.findUnique({
            where: { idActividad: id },
        });
        if (!actividad) throw new NotFoundException('Actividad no encontrada');
        if (actividad.idTenant !== tenantId)
            throw new ForbiddenException('No autorizado');

        return this.prisma.tb_actividad.delete({ where: { idActividad: id } });
    }
}
