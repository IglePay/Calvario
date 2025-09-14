import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

@Injectable()
@Injectable()
export class GrupoService {
    constructor(private prisma: PrismaService) {}

    create(data: CreateGrupoDto & { idTenant: number }) {
        return this.prisma.tb_grupo.create({
            data: {
                nombregrupo: data.nombregrupo,
                idTenant: data.idTenant,
            },
        });
    }

    findAllByTenant(idTenant: number) {
        return this.prisma.tb_grupo.findMany({
            where: { idTenant }, // ✅ solo grupos del tenant
        });
    }

    findOneByTenant(id: number, idTenant: number) {
        return this.prisma.tb_grupo.findFirst({
            where: { idGrupo: id, idTenant }, // ✅ filtra por tenant
        });
    }

    updateByTenant(id: number, data: UpdateGrupoDto, idTenant: number) {
        return this.prisma.tb_grupo.updateMany({
            where: { idGrupo: id, idTenant }, // ✅ solo puede actualizar su tenant
            data: { nombregrupo: data.nombregrupo },
        });
    }

    removeByTenant(id: number, idTenant: number) {
        return this.prisma.tb_grupo.deleteMany({
            where: { idGrupo: id, idTenant }, // ✅ solo puede borrar su tenant
        });
    }
}
