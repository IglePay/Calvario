import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSchedulerDto } from './dto/create-schedule.dto';
import { UpdateSchedulerDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(private prisma: PrismaService) {}

    async findAll(tenantId: number) {
        return this.prisma.tb_servicios.findMany({
            where: { tenantId: tenantId },
            select: {
                idservicio: true,
                horario: true,
                descripcion: true,
            },
        });
    }

    create(data: CreateSchedulerDto, tenantId: number) {
        return this.prisma.tb_servicios.create({
            data: {
                horario: data.horario,
                descripcion: data.descripcion,
                tenantId,
            },
        });
    }

    async update(id: number, data: UpdateSchedulerDto, tenantId: number) {
        const servicio = await this.prisma.tb_servicios.findUnique({
            where: { idservicio: id },
        });

        if (!servicio) {
            throw new NotFoundException('servicio no encotrado');
        }

        if (servicio.tenantId !== tenantId) {
            throw new ForbiddenException('No autorizado');
        }

        return this.prisma.tb_servicios.update({
            where: { idservicio: id },
            data,
            select: {
                idservicio: true,
                horario: true,
                descripcion: true,
            },
        });
    }

    remove(id: number, tenantId: number) {
        return this.prisma.tb_servicios.deleteMany({
            where: { idservicio: id, tenantId },
        });
    }
}
