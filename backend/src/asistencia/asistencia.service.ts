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

    //tabla resumen de  total de visitas de un servicio
    async getResumenServicios(
        tenantId: number,
        page = 1,
        limit = 10,
        search = '',
    ) {
        const skip = (page - 1) * limit;

        // Agrupar por servicio y fecha
        const resumen = await this.prisma.tb_asistencia.groupBy({
            by: ['idservicio', 'fechaServicio'],
            where: { tenantId },
            _sum: { cantidad_asistentes: true },
        });

        // Enriquecer con datos del servicio y formatear fecha
        const mapped = await Promise.all(
            resumen.map(async (r) => {
                const servicio = await this.prisma.tb_servicios.findUnique({
                    where: { idservicio: r.idservicio },
                    select: { idservicio: true, horario: true },
                });

                if (!servicio) {
                    throw new Error(
                        `Servicio con id ${r.idservicio} no encontrado`,
                    );
                }

                // Formatear fecha a "YYYY-MM-DD"
                const fechaFormateada = r.fechaServicio
                    ? r.fechaServicio.toISOString().split('T')[0]
                    : null;

                return {
                    idservicio: servicio.idservicio,
                    horario: servicio.horario,
                    fechaServicio: fechaFormateada,
                    total: r._sum.cantidad_asistentes || 0,
                };
            }),
        );

        // Filtrado por búsqueda (por fecha o horario)
        let filtered = search
            ? mapped.filter((m) => {
                  return (
                      m.horario.toLowerCase().includes(search.toLowerCase()) ||
                      (m.fechaServicio && m.fechaServicio.includes(search))
                  );
              })
            : mapped;

        // Orden descendente: primero por fechaServicio, luego por idservicio
        filtered.sort((a, b) => {
            const dateA = a.fechaServicio
                ? new Date(a.fechaServicio).getTime()
                : 0;
            const dateB = b.fechaServicio
                ? new Date(b.fechaServicio).getTime()
                : 0;

            if (dateA !== dateB) return dateB - dateA; // DESC por fecha
            return b.idservicio - a.idservicio; // DESC por idservicio si fechas iguales
        });

        const total = filtered.length;

        // Paginación
        const pagedData = filtered.slice(skip, skip + limit);

        return {
            data: pagedData,
            total,
            totalPages: Math.ceil(total / limit),
            page,
        };
    }

    //tabla sumary
    async getFamiliasPorServicio(
        tenantId: number,
        idservicio: number,
        fechaServicio: string, // "YYYY-MM-DD"
        page = 1,
        limit = 10,
        search = '',
    ) {
        const skip = (page - 1) * limit;

        // Limites de fecha para ese día
        const start = new Date(fechaServicio);
        start.setHours(0, 0, 0, 0);

        const end = new Date(fechaServicio);
        end.setHours(23, 59, 59, 999);

        // Construir el where base
        const where: any = {
            tenantId,
            idservicio,
            fechaServicio: { gte: start, lte: end },
        };

        // Si hay búsqueda, filtrar por nombre de familia
        if (search && search.trim() !== '') {
            where.familia = {
                is: {
                    nombreFamilia: {
                        contains: search.trim(),
                        // ❌ quitar mode: 'insensitive' → ya no existe en Prisma 6
                    },
                },
            };
        }

        // Traer los datos filtrados con paginación
        const dataRaw = await this.prisma.tb_asistencia.findMany({
            where,
            skip,
            take: limit,
            orderBy: { idasistencia: 'asc' },
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

        // Mapear la fecha a YYYY-MM-DD sin hora
        const data = dataRaw.map((d) => ({
            ...d,
            fechaServicio: d.fechaServicio
                ? d.fechaServicio.toISOString().split('T')[0]
                : null,
        }));

        // Contar total filtrado correctamente
        const total = await this.prisma.tb_asistencia.count({ where });

        return {
            data,
            total,
            totalPages: Math.ceil(total / limit),
            page,
        };
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
        // Verificar que exista
        const exists = await this.prisma.tb_asistencia.findFirst({
            where: { idasistencia: id, tenantId },
        });
        if (!exists)
            throw new NotFoundException(
                `Asistencia ${id} no encontrada para este tenant`,
            );

        // Convertir fechaServicio a Date (Prisma requiere Date)
        const fecha = new Date(dto.fechaServicio);
        fecha.setHours(0, 0, 0, 0); // opcional: normalizar a inicio de día

        // Actualizar registro
        return this.prisma.tb_asistencia.update({
            where: { idasistencia: id },
            data: {
                cantidad_asistentes: dto.cantidadAsistentes,
                idfamilia: dto.idfamilia,
                idservicio: dto.idservicio,
                fechaServicio: fecha, // <-- pasar Date, no string
            },
        });
    }

    // Eliminar registro de horario
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
