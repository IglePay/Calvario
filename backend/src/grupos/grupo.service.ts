import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GrupoService {
    constructor(private prisma: PrismaService) {}

    create(data: any) {
        return this.prisma.tb_grupo.create({ data });
    }

    findAll() {
        return this.prisma.tb_grupo.findMany();
    }

    findOne(id: number) {
        return this.prisma.tb_grupo.findUnique({ where: { idGrupo: id } });
    }

    update(id: number, data: any) {
        return this.prisma.tb_grupo.update({ where: { idGrupo: id }, data });
    }

    remove(id: number) {
        return this.prisma.tb_grupo.delete({ where: { idGrupo: id } });
    }
}
