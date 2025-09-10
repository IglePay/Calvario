import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EstadoCivilService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.tb_estadocivil.findMany({
            select: { idEstado: true, nombreEstado: true }, // solo id y nombre
        });
    }

    async findOneById(id: number) {
        const estadoCivil = await this.prisma.tb_estadocivil.findUnique({
            where: { idEstado: id },
            select: { idEstado: true, nombreEstado: true },
        });
        if (!estadoCivil) {
            throw new NotFoundException(
                `Estado civil con ID ${id} no encontrado`,
            );
        }
        return estadoCivil;
    }

    async findOneByName(nombre: string) {
        const estadoCivil = await this.prisma.tb_estadocivil.findFirst({
            where: { nombreEstado: nombre },
            select: { idEstado: true, nombreEstado: true },
        });
        if (!estadoCivil) {
            throw new NotFoundException(
                `Estado civil con nombre ${nombre} no encontrado`,
            );
        }
        return estadoCivil;
    }
}
