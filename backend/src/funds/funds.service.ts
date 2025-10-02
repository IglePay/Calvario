import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';

@Injectable()
export class FundsService {
    constructor(private prisma: PrismaService) {}

    async findAll(tenantId: number, page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;

        // Filtro opcional por búsqueda
        const where: any = {
            tenantId,
            isDeleted: false,
        };

        if (search) {
            where.OR = [
                { descripcion: { contains: search, mode: 'insensitive' } },
                {
                    nomeclatura: {
                        nombre: { contains: search, mode: 'insensitive' },
                    },
                },
            ];
        }

        // Total de registros
        const total = await this.prisma.tb_operacion.count({ where });

        // Registros paginados
        const operaciones = await this.prisma.tb_operacion.findMany({
            where,
            skip,
            take: limit,
            orderBy: { fecha: 'desc' },
            include: {
                nomeclatura: true,
            },
        });

        let saldo = 0;
        const result = operaciones.map((op) => {
            if (op.nomeclatura.tipoIE === 'Ingreso') {
                saldo += Number(op.monto);
            } else {
                saldo -= Number(op.monto);
            }

            // Formatear solo la fecha: YYYY-MM-DD
            const fechaFormateada = op.fecha.toISOString().split('T')[0];

            return {
                id: op.idoperacion,
                idnomeclatura: op.idnomeclatura,
                nombre: op.nomeclatura.nombre,
                descripcion: op.descripcion,
                fecha: fechaFormateada, // <-- solo fecha
                tipo: op.nomeclatura.tipoIE,
                monto: Number(op.monto),
                saldo,
            };
        });

        return {
            data: result,
            total,
            totalPages: Math.ceil(total / limit),
            page,
        };
    }

    async create(tenantId: number, dto: CreateFundDto) {
        return this.prisma.tb_operacion.create({
            data: { ...dto, tenantId },
        });
    }

    async update(id: number, tenantId: number, dto: UpdateFundDto) {
        const fund = await this.prisma.tb_operacion.findFirst({
            where: { idoperacion: id, tenantId },
        });
        if (!fund) throw new NotFoundException('Fondo no encontrado');
        return this.prisma.tb_operacion.update({
            where: { idoperacion: id },
            data: dto,
        });
    }

    async delete(id: number, tenantId: number) {
        const fund = await this.prisma.tb_operacion.findFirst({
            where: { idoperacion: id, tenantId },
        });
        if (!fund) throw new NotFoundException('Fondo no encontrado');

        return this.prisma.tb_operacion.update({
            where: { idoperacion: id },
            data: { isDeleted: true },
        });
    }

    async restore(id: number, tenantId: number) {
        const fund = await this.prisma.tb_operacion.findFirst({
            where: { idoperacion: id, tenantId },
        });
        if (!fund) throw new NotFoundException('Fondo no encontrado');

        return this.prisma.tb_operacion.update({
            where: { idoperacion: id },
            data: { isDeleted: false },
        });
    }
}
