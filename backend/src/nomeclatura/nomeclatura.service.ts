import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNomeclaturaDto } from './dto/create-nomeclatura.dto';
import { UpdateNomeclaturaDto } from './dto/update-nomeclatura.dto';

@Injectable()
export class NomeclaturaService {
    constructor(private prisma: PrismaService) {}

    async create(tenantId: number, dto: CreateNomeclaturaDto) {
        try {
            return await this.prisma.tb_nomeclatura.create({
                data: {
                    tenantId,
                    ...dto,
                },
            });
        } catch (err) {
            if (err.code === 'P2002') {
                throw new BadRequestException(
                    `El código "${dto.codigo}" ya está en uso. Elige otro.`,
                );
            }
            throw err;
        }
    }

    async findAll(tenantId: number, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [data, total] = await this.prisma.$transaction([
            this.prisma.tb_nomeclatura.findMany({
                where: { tenantId },
                orderBy: { codigo: 'asc' },
                skip,
                take: limit,
                select: {
                    idnomeclatura: true,
                    codigo: true,
                    nombre: true,
                    tipoIE: true,
                    // fechaCreacion:true,
                },
            }),
            this.prisma.tb_nomeclatura.count({
                where: { tenantId },
            }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    // para modulo de fondos obtner los nombres
    async findSimple(tenantId: number) {
        return this.prisma.tb_nomeclatura.findMany({
            where: { tenantId },
            orderBy: { codigo: 'asc' },
            select: {
                idnomeclatura: true,
                nombre: true,
                tenantId: true,
            },
        });
    }

    async update(id: number, tenantId: number, dto: UpdateNomeclaturaDto) {
        try {
            return await this.prisma.tb_nomeclatura.update({
                where: { idnomeclatura: id },
                data: {
                    tenantId,
                    ...dto,
                },
            });
        } catch (err) {
            if (err.code === 'P2002') {
                throw new BadRequestException(
                    `El código "${dto.codigo}" ya está en uso. No se puede actualizar.`,
                );
            }
            throw err;
        }
    }

    async remove(id: number, tenantId: number) {
        return this.prisma.tb_nomeclatura.delete({
            where: { idnomeclatura: id },
        });
    }
}
