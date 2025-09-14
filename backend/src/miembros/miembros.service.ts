import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MiembrosService {
    constructor(private readonly prisma: PrismaService) {}

    // Helper para normalizar flags (puede venir 'S'|'N', boolean, o undefined)
    private normalizeFlag(primary: any, secondary: any): string | null {
        // primary: preferido (p.e. "S"|"N" o undefined)
        // secondary: boolean (p.e. formData.bautizo)
        if (typeof primary === 'string') {
            return primary;
        }
        if (typeof primary === 'boolean') {
            return primary ? 'S' : 'N';
        }
        if (typeof secondary === 'string') {
            return secondary;
        }
        if (typeof secondary === 'boolean') {
            return secondary ? 'S' : 'N';
        }
        return null;
    }

    // Helper para normalizar fecha (acepta YYYY-MM-DD o ISO, retorna Date o null)
    private parseDate(value: any): Date | null {
        if (!value && value !== 0) return null;
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    // Crear miembro (excluyendo idMiembro e idTenant)
    async create(createMiembroDto: any, tenantId: number) {
        const {
            dpi,
            nombre,
            apellido,
            email,
            telefono,
            fechanacimiento, // string (YYYY-MM-DD) o null
            sexo, // idGenero
            direccion,
            estadoCivil, // idEstado
            anioLlegada, // fechallegada (YYYY-MM-DD)
            // pueden venir ambos: `bautizo` (boolean) y `bautismo` (string 'S'|'N')
            bautizo,
            bautismo,
            fechabautizo,
            // servidor puede venir como boolean `servidor` y/o string `servidor`
            servidor,
            procescos, // procesosterminado
            grupo, // idGrupo
            legusta,
        } = createMiembroDto;

        const bautismoNormalizado =
            this.normalizeFlag(bautismo, bautizo) ?? 'N';
        const servidorNormalizado = this.normalizeFlag(servidor, null) ?? 'N';

        return this.prisma.tb_miembros.create({
            data: {
                idTenant: tenantId,
                dpi: dpi || null,
                nombre,
                apellido,
                email: email || null,
                telefono: telefono || null,
                fechanacimiento: this.parseDate(fechanacimiento),
                idGenero: sexo ? Number(sexo) : null,
                direccion: direccion || null,
                idEstado: estadoCivil ? Number(estadoCivil) : null,
                fechallegada: this.parseDate(anioLlegada),
                bautismo: bautismoNormalizado, // 'S' | 'N'
                fechabautismo: this.parseDate(fechabautizo),
                servidor: servidorNormalizado, // 'S' | 'N'
                procesosterminado: procescos ?? null,
                idGrupo: grupo ? Number(grupo) : null,
                legusta: legusta ?? null,
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
                fechanacimiento: m.fechanacimiento
                    ? m.fechanacimiento.toISOString().split('T')[0]
                    : null,
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

        return {
            ...miembro,
            edad,
            fechanacimiento: miembro.fechanacimiento
                ? miembro.fechanacimiento.toISOString().split('T')[0]
                : null,
            fechallegada: miembro.fechallegada
                ? miembro.fechallegada.toISOString().split('T')[0]
                : null,
            fechabautismo: miembro.fechabautismo
                ? miembro.fechabautismo.toISOString().split('T')[0]
                : null,
        };
    }

    async update(id: number, updateMiembroDto: any) {
        const {
            nombre,
            apellido,
            telefono,
            direccion,
            fechanacimiento,
            fechallegada,
            bautizo,
            bautismo,
            fechabautismo,
            servidor,
            procesosterminado,
            idGrupo,
        } = updateMiembroDto;

        const bautismoNormalizado = this.normalizeFlag(bautismo, bautizo);
        const servidorNormalizado = this.normalizeFlag(servidor, null);

        return this.prisma.tb_miembros.update({
            where: { idMiembro: id },
            data: {
                nombre,
                apellido,
                telefono,
                direccion,
                fechanacimiento: this.parseDate(fechanacimiento),
                fechallegada: this.parseDate(fechallegada),
                bautismo: bautismoNormalizado ?? undefined, // si undefined -> no actualiza campo
                fechabautismo: this.parseDate(fechabautismo),
                servidor: servidorNormalizado ?? undefined,
                procesosterminado: procesosterminado ?? null,
                idGrupo: idGrupo ? Number(idGrupo) : null,
            },
        });
    }

    async remove(id: number) {
        return this.prisma.tb_miembros.delete({
            where: { idMiembro: id },
        });
    }
}
