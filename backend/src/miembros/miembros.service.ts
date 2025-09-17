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
    async createMiembro(dto: CreateMiembroDto, idTenant: number) {
        return this.prisma.tb_miembros.create({
            data: {
                idTenant,
                nombre: dto.nombre,
                apellido: dto.apellido,
                email: dto.email || null,
                telefono: dto.telefono || null,
                dpi: dto.dpi || null,
                fechanacimiento: dto.fechaNacimiento || null,
                idGenero: dto.idGenero || null,
                idEstado: dto.idEstado || null,
                direccion: dto.direccion || null,
                procesosterminado: dto.procesosTerminado || null,
                idGrupo: dto.idGrupo || null,
                legusta: dto.leGusta || null,
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
        if (!miembro || miembro.idTenant !== idTenant) {
            throw new Error('Miembro no encontrado o acceso denegado');
        }

        return this.prisma.tb_miembros.update({
            where: { idMiembro },
            data: {
                nombre: dto.nombre,
                apellido: dto.apellido,
                email: dto.email || null,
                telefono: dto.telefono || null,
                dpi: dto.dpi || null,
                fechanacimiento: dto.fechaNacimiento || null,
                idGenero: dto.idGenero || null,
                idEstado: dto.idEstado || null,
                direccion: dto.direccion || null,
                procesosterminado: dto.procesosTerminado || null,
                idGrupo: dto.idGrupo || null,
                legusta: dto.leGusta || null,
                fechaLlegada: dto.fechaLlegada || null,
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

    async getBautizados(idTenant: number) {
        return this.prisma.tb_bautizados.findMany({
            where: { idTenant },
            select: {
                idBautizado: true,
                bautizadoEstado: true,
            },
        });
    }

    async getServidores(idTenant: number) {
        return this.prisma.tb_servidores.findMany({
            where: { idTenant },
            select: {
                idServidor: true,
                servidorEstado: true,
            },
        });
    }

    async findAllForTenant(idTenant: number) {
        return this.prisma.tb_miembros.findMany({
            where: { idTenant },
            include: {
                grupo: true,
                genero: true,
                estadoCivil: true,
                bautizado: true, // corregido
                servidor: true, // corregido
            },
        });
    }

    async findAllForTableForTenant(idTenant: number) {
        const miembros = await this.prisma.tb_miembros.findMany({
            where: { idTenant },
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
                fechanacimiento: true, // temporal para calcular edad
            },
        });

        // Calcular edad y eliminar fechanacimiento
        const miembrosConEdad = miembros.map((m) => {
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
            const { fechanacimiento, ...rest } = m; // quitar fechanacimiento
            return { ...rest, edad };
        });

        return miembrosConEdad;
    }

    async deleteMiembro(idMiembro: number, idTenant: number) {
        // Primero verificamos que exista y pertenezca al tenant
        const miembro = await this.prisma.tb_miembros.findUnique({
            where: { idMiembro },
        });

        if (!miembro || miembro.idTenant !== idTenant) {
            throw new Error('Miembro no encontrado o acceso denegado');
        }

        return this.prisma.tb_miembros.delete({
            where: { idMiembro },
        });
    }
}
