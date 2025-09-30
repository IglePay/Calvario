import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMiembroDto } from './dto/create.miembro.dto';
import { UpdateMiembroDto } from './dto/update.miembro.dto';

@Injectable()
export class MiembrosService {
    constructor(private readonly prisma: PrismaService) {}

    // miembros.service.ts
    // Obtener usuarios filtrados por rol, búsqueda y paginación
    async getUsuariosByRolForTenant(
        roleId: number,
        page = 1,
        limit = 10,
        search?: string,
    ) {
        // Obtener el nombre del rol del usuario
        const userRole = await this.prisma.tb_role.findUnique({
            where: { id: roleId },
            select: { nombre: true },
        });

        if (!userRole) throw new Error('Rol no encontrado');

        //  Determinar roles permitidos según el rol actual
        let allowedRoles: string[] = [];
        if (userRole.nombre === 'admin') {
            allowedRoles = ['admin', 'pastor', 'miembro'];
        } else if (userRole.nombre === 'pastor') {
            allowedRoles = ['secretario', 'tesorero', 'coordinador'];
        }

        //  Construir condiciones WHERE
        const whereCondition: any = {
            role: { nombre: { in: allowedRoles } },
        };

        if (search) {
            // Prisma 6+ no tiene "mode: insensitive", hacemos todo en lowercase en JS
            const searchLower = search.toLowerCase();
            whereCondition.OR = [
                { name: { contains: searchLower } },
                { email: { contains: searchLower } },
                {
                    tb_tenants: {
                        nombre: { contains: searchLower },
                    },
                },
            ];
        }

        //  Obtener datos y total en una transacción
        const [data, total] = await this.prisma.$transaction([
            this.prisma.tb_user.findMany({
                where: whereCondition,
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: { select: { nombre: true } },
                    tb_tenants: { select: { nombre: true } },
                },
            }),
            this.prisma.tb_user.count({ where: whereCondition }),
        ]);

        // Devolver datos con paginado
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
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

    // tabla userrio assignar role y tenant
    async findAllForTableForTenant(
        tenantId: number,
        page = 1,
        limit = 10,
        search?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: any = { tenantId };

        if (search) {
            where.OR = [
                { nombre: { contains: search, mode: 'insensitive' } },
                { apellido: { contains: search, mode: 'insensitive' } },
                { telefono: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [total, miembros] = await Promise.all([
            this.prisma.tb_miembros.count({ where }),
            this.prisma.tb_miembros.findMany({
                where,
                skip,
                take: limit,
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
                    genero: { select: { nombregenero: true } },
                    idEstado: true,
                    estadoCivil: { select: { nombreEstado: true } },
                    idGrupo: true,
                    grupo: { select: { nombregrupo: true } },
                    procesosterminado: true,
                    legusta: true,
                    idBautizado: true,
                    idServidor: true,
                },
                orderBy: { nombre: 'asc' },
            }),
        ]);

        const miembrosFormateados = miembros.map((m) => {
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

            const formatDate = (date: Date | string | null | undefined) =>
                date ? new Date(date).toISOString().split('T')[0] : null;

            return {
                ...m,
                edad,
                fechaLlegada: formatDate(m.fechaLlegada),
                fechaBautismo: formatDate(m.fechaBautismo),
            };
        });

        return {
            data: miembrosFormateados,
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    // dashboard
    async getEstadisticas(tenantId: number) {
        const miembros = await this.prisma.tb_miembros.findMany({
            where: { tenantId },
            select: {
                fechanacimiento: true,
                idGenero: true,
                idBautizado: true,
                idEstado: true,
                idServidor: true,
            },
        });

        const today = new Date();

        const stats = {
            total_miembros: miembros.length,
            hombres: 0,
            mujeres: 0,
            servidores: 0,
            ninos: 0,
            adolescentes: 0,
            jovenes: 0,
            adultos: 0,
            no_bautizados: 0,
            bautizados: 0,
            casados: 0,
            solteros: 0,
        };

        for (const m of miembros) {
            // Hombres/Mujeres
            if (m.idGenero === 1) stats.hombres++;
            else if (m.idGenero === 2) stats.mujeres++;

            // Servidores
            if (m.idServidor === 1) stats.servidores++;

            // Bautizados
            if (m.idBautizado === 1) stats.no_bautizados++;
            else if (m.idBautizado === 2) stats.bautizados++;

            // Estado civil
            if (m.idEstado === 1) stats.solteros++;
            else if (m.idEstado === 2) stats.casados++;

            // Edad
            if (m.fechanacimiento) {
                const birthDate = new Date(m.fechanacimiento);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (
                    monthDiff < 0 ||
                    (monthDiff === 0 && today.getDate() < birthDate.getDate())
                ) {
                    age--;
                }

                if (age < 12) stats.ninos++;
                else if (age >= 13 && age <= 17) stats.adolescentes++;
                else if (age >= 18 && age <= 19) stats.jovenes++;
                else if (age >= 20) stats.adultos++;
            }
        }

        return stats;
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
