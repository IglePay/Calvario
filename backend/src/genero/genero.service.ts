import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GeneroService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.tb_genero.findMany({
            select: { idGenero: true, nombregenero: true }, // solo id y nombre
        });
    }

    async findOneById(id: number) {
        return this.prisma.tb_genero.findUnique({
            where: { idGenero: id },
            select: { idGenero: true, nombregenero: true },
        });
    }

    async findOneByName(nombre: string) {
        return this.prisma.tb_genero.findFirst({
            where: { nombregenero: nombre },
            select: { idGenero: true, nombregenero: true },
        });
    }
    //
    // async findWithPagination(page: number, limit: number) {
    //     const skip = (page - 1) * limit;
    //     const [data, total] = await Promise.all([
    //         this.prisma.genero.findMany({
    //             skip,
    //             take: limit,
    //             select: { id: true, nombre: true },
    //         }),
    //         this.prisma.genero.count(),
    //     ]);
    //
    //     return {
    //         data,
    //         total,
    //         page,
    //         last_page: Math.ceil(total / limit),
    //     };
    // }
}
