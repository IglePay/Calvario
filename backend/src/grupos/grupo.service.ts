import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

@Injectable()
export class GrupoService {
    constructor(private prisma: PrismaService) {}

    create(data: CreateGrupoDto & { idTenant: number }) {
        return this.prisma.tb_grupo.create({
            data: {
                nombregrupo: data.nombregrupo,
                idTenant: data.idTenant, // ✅ nunca undefined
            },
        });
    }

    findAll() {
        return this.prisma.tb_grupo.findMany();
    }

    findOne(id: number) {
        return this.prisma.tb_grupo.findUnique({ where: { idGrupo: id } });
    }

    update(id: number, data: UpdateGrupoDto) {
        return this.prisma.tb_grupo.update({
            where: { idGrupo: id },
            data: {
                ...(data.nombregrupo && { nombregrupo: data.nombregrupo }),
            },
        });
    }

    remove(id: number) {
        return this.prisma.tb_grupo.delete({ where: { idGrupo: id } });
    }
}
