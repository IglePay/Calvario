import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMiembroDto } from './dto/create.miembro.dto';

@Injectable()
export class MiembrosService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.tb_miembros.findMany({
            include: {
                grupo: true,
                genero: true,
                estadoCivil: true,
                servidor: true, // corregido
                bautizado: true, // corregido
            },
        });
    }

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
                // Relaciones (FKs)
                idBautizado: dto.idBautizado || null,
                idServidor: dto.idServidor || null,
            },
            include: {
                bautizado: {
                    select: {
                        idBautizado: true,
                        bautizadoEstado: true,
                        fechaBautismo: true,
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
        dto: CreateMiembroDto,
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
                // Relaciones (FKs)
                idBautizado: dto.idBautizado || null,
                idServidor: dto.idServidor || null,
            },
            include: {
                bautizado: {
                    select: {
                        idBautizado: true,
                        bautizadoEstado: true,
                        fechaBautismo: true,
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
        return this.prisma.tb_miembros.findMany({
            where: { idTenant },
            select: {
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
}
