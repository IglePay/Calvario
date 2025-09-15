import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.tb_role.findMany({
            select: { id: true, nombre: true }, // solo id y nombre
        });
    }

    async findOneById(id: number) {
        return this.prisma.tb_role.findUnique({
            where: { id },
            select: { id: true, nombre: true },
        });
    }

    async findOneByName(nombre: string) {
        return this.prisma.tb_role.findFirst({
            where: { nombre },
            select: { id: true, nombre: true },
        });
    }
}
