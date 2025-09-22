import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamilyService {
    constructor(private prisma: PrismaService) {}

    async findAll(tenantId: number) {
        return this.prisma.tb_familias.findMany({
            where: { tenantId: tenantId },
            select: {
                idfamilia: true,
                nombreFamilia: true,
                cantidadfamilia: true,
            },
        });
    }

    create(data: CreateFamilyDto, tenantId: number) {
        return this.prisma.tb_familias.create({
            data: {
                nombreFamilia: data.nombreFamilia,
                cantidadfamilia: data.cantidadfamilia,
                tenantId,
            },
        });
    }

    async update(id: number, data: UpdateFamilyDto, tenantId: number) {
        // 1. Buscar si existe la familia
        const familia = await this.prisma.tb_familias.findUnique({
            where: { idfamilia: id },
        });

        if (!familia) {
            throw new NotFoundException('Familia no encontrada');
        }

        // 2. Validar que pertenezca al tenant actual
        if (familia.tenantId !== tenantId) {
            throw new ForbiddenException('No autorizado');
        }

        // 3. Actualizar y devolver la familia actualizada
        return this.prisma.tb_familias.update({
            where: { idfamilia: id },
            data,
            select: {
                idfamilia: true,
                nombreFamilia: true,
                cantidadfamilia: true,
            },
        });
    }

    remove(id: number, tenantId: number) {
        return this.prisma.tb_familias.deleteMany({
            where: { idfamilia: id, tenantId },
        });
    }
}
