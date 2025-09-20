import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMiembroDto } from './dto/create.miembro.dto';
import { UpdateMiembroDto } from './dto/update.miembro.dto';

@Injectable()
export class MiembrosService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllForTable() {
        return this.prisma.tb_miembros.findMany({
            select: {
                idMiembro: true,
                nombre: true,
                apellido: true,
                telefono: true,
                direccion: true,
                fechaLlegada: true,
                procesosterminado: true,
                idGrupo: true,
                grupo: {
                    select: { nombregrupo: true },
                },
            },
        });
    }

    // miembros.service.ts
    async createMiembro(dto: CreateMiembroDto, tenantId: number) {
        return this.prisma.tb_miembros.create({
            data: {
                tenantId,
                dpi: dto.dpi || null,
                nombre: dto.nombre,
                apellido: dto.apellido,
                email: dto.email || null,
                telefono: dto.telefono || null,
                fechanacimiento: dto.fechaNacimiento || null,
                idGenero: dto.idGenero || null,
                direccion: dto.direccion || null,
                idEstado: dto.idEstado || null,
                procesosterminado: dto.procesosterminado || null,
                idGrupo: dto.idGrupo || null,
                legusta: dto.legusta || null,
                fechaLlegada: dto.fechaLlegada || null, // antes anioLlegada
                fechaBautismo: dto.fechaBautismo || null,
                // Relaciones (FKs)
                idBautizado: dto.idBautizado || null,
                idServidor: dto.idServidor || null,
            },
            include: {
                bautizado: {
                    select: {
                        idBautizado: true,
                        bautizadoEstado: true,
                    },
                },
                servidor: {
                    select: {
                        idServidor: true,
                        servidorEstado: true,
                    },
                },
                grupo: true,
                genero: true,
                estadoCivil: true,
            },
        });
    }

    async updateMiembro(
        idMiembro: number,
        dto: UpdateMiembroDto,
        idTenant: number,
    ) {
        const miembro = await this.prisma.tb_miembros.findUnique({
            where: { idMiembro },
        });
        if (!miembro || miembro.tenantId !== idTenant) {
            throw new Error('Miembro no encontrado o acceso denegado');
        }

        return this.prisma.tb_miembros.update({
            where: { idMiembro },
            data: {
                dpi: dto.dpi || null,
                nombre: dto.nombre,
                apellido: dto.apellido,
                email: dto.email || null,
                telefono: dto.telefono || null,
                fechanacimiento: dto.fechaNacimiento || null,
                idGenero: dto.idGenero || null,
                direccion: dto.direccion || null,
                idEstado: dto.idEstado || null,
                fechaLlegada: dto.fechaLlegada || null,
                fechaBautismo: dto.fechaBautismo || null,
                procesosterminado: dto.procesosterminado || null,
                idGrupo: dto.idGrupo || null,
                legusta: dto.legusta || null,
                // Relaciones (FKs)
                idBautizado: dto.idBautizado || null,
                idServidor: dto.idServidor || null,
            },
            include: {
                bautizado: {
                    select: {
                        idBautizado: true,
                        bautizadoEstado: true,
                    },
                },
                servidor: {
                    select: {
                        idServidor: true,
                        servidorEstado: true,
                    },
                },
                grupo: true,
                genero: true,
                estadoCivil: true,
            },
        });
    }

    async getBautizados(tenantId: number) {
        return this.prisma.tb_bautizados.findMany({
            where: { tenantId },
            select: {
                idBautizado: true,
                bautizadoEstado: true,
            },
        });
    }

    async getServidores(tenantId: number) {
        return this.prisma.tb_servidores.findMany({
            where: { tenantId },
            select: {
                idServidor: true,
                servidorEstado: true,
            },
        });
    }

    async findAllForTenant(tenantId: number) {
        return this.prisma.tb_miembros.findMany({
            where: { tenantId },
            include: {
                grupo: true,
                genero: true,
                estadoCivil: true,
                bautizado: true,
                servidor: true,
            },
        });
    }

    async findAllForTableForTenant(tenantId: number) {
        const miembros = await this.prisma.tb_miembros.findMany({
            where: { tenantId },
            select: {
                dpi: true,
                idMiembro: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                direccion: true,
                fechanacimiento: true,
                fechaLlegada: true,
                fechaBautismo: true,
                idGenero: true,
                genero: {
                    select: {
                        nombregenero: true,
                    },
                },
                idEstado: true,
                estadoCivil: {
                    select: { nombreEstado: true },
                },
                idGrupo: true,
                grupo: {
                    select: { nombregrupo: true },
                },
                procesosterminado: true,
                legusta: true,
                idBautizado: true,
                idServidor: true,
            },
        });

        const miembrosFormateados = miembros.map((m) => {
            // Calcular edad
            let edad: number | null = null;
            if (m.fechanacimiento) {
                const today = new Date();
                const birthDate = new Date(m.fechanacimiento);
                edad = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (
                    monthDiff < 0 ||
                    (monthDiff === 0 && today.getDate() < birthDate.getDate())
                ) {
                    edad--;
                }
            }

            // Formatear fechas a YYYY-MM-DD
            const formatDate = (date: Date | string | null | undefined) =>
                date ? new Date(date).toISOString().split('T')[0] : null;

            const fechaLlegada = formatDate(m.fechaLlegada);
            const fechaBautismo = formatDate(m.fechaBautismo);

            const { fechanacimiento, ...rest } = m; // quitar fechanacimiento

            return {
                ...rest,
                edad,
                fechaLlegada,
                fechaBautismo,
                fechanacimiento,
            };
        });

        return miembrosFormateados;
    }

    async deleteMiembro(idMiembro: number, idTenant: number) {
        const miembro = await this.prisma.tb_miembros.findUnique({
            where: { idMiembro },
        });

        if (!miembro || miembro.tenantId !== idTenant) {
            throw new Error('Miembro no encontrado o acceso denegado');
        }

        return this.prisma.tb_miembros.delete({
            where: { idMiembro },
        });
    }
}
