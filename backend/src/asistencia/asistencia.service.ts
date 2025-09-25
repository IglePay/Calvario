import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

@Injectable()
export class AsistenciaService {
    constructor(private prisma: PrismaService) {}

    async findAll(tenantId: number) {
        return this.prisma.tb_asistencia.findMany({
            where: { tenantId },
            select: {
                idasistencia: true,
                cantidad_asistentes: true,
                fechaServicio: true,
                familia: {
                    select: {
                        idfamilia: true,
                        nombreFamilia: true,
                    },
                },
                servicio: {
                    select: {
                        idservicio: true,
                        horario: true,
                    },
                },
            },
        });
    }

    async getResumenServicios(tenantId: number) {
        // Agrupa las asistencias por servicio y fecha
        const resumen = await this.prisma.tb_asistencia.groupBy({
            by: ['idservicio', 'fechaServicio'],
            where: { tenantId },
            _sum: {
                cantidad_asistentes: true,
            },
        });

        // Mapea cada grupo agregando los datos del servicio
        return Promise.all(
            resumen.map(async (r) => {
                const servicio = await this.prisma.tb_servicios.findUnique({
                    where: { idservicio: r.idservicio },
                    select: { idservicio: true, horario: true },
                });

                if (!servicio) {
                    // Lanzar error si el servicio no existe
                    throw new Error(
                        `Servicio con id ${r.idservicio} no encontrado`,
                    );
                }

                return {
                    idservicio: servicio.idservicio,
                    horario: servicio.horario,
                    fechaServicio: r.fechaServicio, // Incluye la fecha
                    total: r._sum.cantidad_asistentes || 0, // Asegura que no sea undefined
                };
            }),
        );
    }

    async getFamiliasPorServicio(
        tenantId: number,
        idservicio: number,
        fechaServicio: string, // "YYYY-MM-DD"
    ) {
        const start = new Date(fechaServicio);
        start.setHours(0, 0, 0, 0);

        const end = new Date(fechaServicio);
        end.setHours(23, 59, 59, 999);

        return this.prisma.tb_asistencia.findMany({
            where: {
                tenantId,
                idservicio,
                fechaServicio: {
                    gte: start,
                    lte: end,
                },
            },
            select: {
                idasistencia: true,
                cantidad_asistentes: true,
                fechaServicio: true,
                familia: { select: { idfamilia: true, nombreFamilia: true } },
                servicio: { select: { idservicio: true, horario: true } },
            },
        });
    }

    // Crear asistencia
    async create(tenantId: number, dto: CreateAsistenciaDto) {
        return this.prisma.tb_asistencia.create({
            data: {
                tenantId,
                idfamilia: dto.idfamilia,
                idservicio: dto.idservicio,
                cantidad_asistentes: dto.cantidadAsistentes,
                fechaServicio: dto.fechaServicio,
            },
        });
    }

    // Actualizar asistencia con tenantId
    async update(tenantId: number, id: number, dto: UpdateAsistenciaDto) {
        const exists = await this.prisma.tb_asistencia.findFirst({
            where: { idasistencia: id, tenantId },
        });
        if (!exists)
            throw new NotFoundException(
                `Asistencia ${id} no encontrada para este tenant`,
            );

        return this.prisma.tb_asistencia.update({
            where: { idasistencia: id },
            data: {
                cantidad_asistentes: dto.cantidadAsistentes,
                idfamilia: dto.idfamilia,
                idservicio: dto.idservicio,
                fechaServicio: dto.fechaServicio,
            },
        });
    }

    // Eliminar asistencia con tenantId
    async remove(tenantId: number, id: number) {
        if (!id || Number.isNaN(id)) {
            throw new BadRequestException('ID inválido');
        }

        const asistencia = await this.prisma.tb_asistencia.findFirst({
            where: { idasistencia: id, tenantId },
        });

        if (!asistencia) {
            throw new NotFoundException(
                `Asistencia ${id} no encontrada para este tenant`,
            );
        }

        return this.prisma.tb_asistencia.delete({
            where: { idasistencia: id },
        });
    }
}
