import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MiembrosService {
    constructor(private readonly prisma: PrismaService) {}

    // Crear miembro (excluyendo idMiembro e idTenant)
    async create(createMiembroDto: any, tenantId: number) {
        // Mapeo de campos opcionales y relaciones
        const {
            dpi,
            nombre,
            apellido,
            email,
            telefono,
            fechanacimiento,
            sexo, // idGenero
            direccion,
            estadoCivil, // idEstado
            anioLlegada, // fechallegada
            bautizo, // bautismo
            fechabautizo, // fechabautismo
            servidor,
            procescos, // procesosterminado
            grupo, // idGrupo
            legusta,
        } = createMiembroDto;

        return this.prisma.tb_miembros.create({
            data: {
                idTenant: tenantId,
                dpi,
                nombre,
                apellido,
                email,
                telefono,
                fechanacimiento: fechanacimiento
                    ? new Date(fechanacimiento)
                    : null,
                idGenero: sexo ?? null,
                direccion,
                idEstado: estadoCivil ?? null,
                fechallegada: anioLlegada
                    ? new Date(`${anioLlegada}-01-01`)
                    : null,
                bautismo: bautizo ?? 'N',
                fechabautismo: fechabautizo ? new Date(fechabautizo) : null,
                servidor: servidor ?? 'N',
                procesosterminado: procescos,
                idGrupo: grupo ?? null,
                legusta,
            },
        });
    }
    // Obtener todos los miembros con edad calculada y relaciones
    async findAll() {
        const miembros = await this.prisma.tb_miembros.findMany({
            select: {
                idMiembro: true,
                dpi: true,
                nombre: true,
                apellido: true,
                email: true,
                fechanacimiento: true,
                telefono: true,
                direccion: true,
                fechallegada: true,
                bautismo: true,
                fechabautismo: true,
                servidor: true,
                procesosterminado: true,
                idGrupo: true,
                genero: { select: { idGenero: true, nombregenero: true } },
                estadoCivil: { select: { idEstado: true, nombreEstado: true } },
                grupo: { select: { idGrupo: true, nombregrupo: true } },
                legusta: true,
            },
        });

        return miembros.map((m) => {
            let edad: number | null = null;
            if (m.fechanacimiento) {
                const diff = Date.now() - m.fechanacimiento.getTime();
                edad = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            }

            return {
                ...m,
                edad,
                // solo devuelve la fecha en formato YYYY-MM-DD
                fechallegada: m.fechallegada
                    ? m.fechallegada.toISOString().split('T')[0]
                    : null,
                fechabautismo: m.fechabautismo
                    ? m.fechabautismo.toISOString().split('T')[0]
                    : null,
            };
        });
    }

    async findOne(id: number) {
        const miembro = await this.prisma.tb_miembros.findUnique({
            where: { idMiembro: id },
            include: {
                genero: true,
                estadoCivil: true,
                grupo: true,
            },
        });
        if (!miembro) {
            throw new NotFoundException(`Miembro con ID ${id} no encontrado`);
        }

        let edad: number | null = null;
        if (miembro.fechanacimiento) {
            const diff = Date.now() - miembro.fechanacimiento.getTime();
            edad = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }

        return { ...miembro, edad };
    }

    async update(id: number, updateMiembroDto: any) {
        const {
            nombre,
            apellido,
            telefono,
            direccion,
            fechallegada,
            bautismo,
            procesosterminado,
            idGrupo,
        } = updateMiembroDto;

        return this.prisma.tb_miembros.update({
            where: { idMiembro: id },
            data: {
                nombre,
                apellido,
                telefono,
                direccion,
                fechallegada: fechallegada ? new Date(fechallegada) : null,
                bautismo,
                procesosterminado,
                idGrupo,
            },
        });
    }

    async remove(id: number) {
        return this.prisma.tb_miembros.delete({
            where: { idMiembro: id },
        });
    }
}
