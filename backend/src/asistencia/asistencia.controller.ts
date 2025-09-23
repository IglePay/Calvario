import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Query,
    BadRequestException,
} from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

@UseGuards(AuthGuard)
@Controller('asistencia')
export class AsistenciaController {
    constructor(private readonly asistenciaService: AsistenciaService) {}

    @Get()
    findAll(@Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.asistenciaService.findAll(tenantId);
    }

    // Obtener resumen por servicio + fecha
    @Get('resumen-servicios')
    getResumenServicios(@Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.asistenciaService.getResumenServicios(tenantId);
    }

    // Obtener familias por servicio + fecha
    @Get('familias-por-servicio')
    getFamiliasPorServicio(
        @Req() req: Request & { user: any },
        @Query('idservicio') idservicio: string,
        @Query('fechaServicio') fechaServicio: string,
    ) {
        if (!idservicio)
            throw new BadRequestException('idservicio es requerido');
        if (!fechaServicio)
            throw new BadRequestException('fechaServicio es requerido');

        // solo validar que sea fecha válida
        if (isNaN(Date.parse(fechaServicio)))
            throw new BadRequestException('fechaServicio inválida');

        const tenantId = req.user.tenantId;

        // PASAMOS STRING, no Date
        return this.asistenciaService.getFamiliasPorServicio(
            tenantId,
            Number(idservicio),
            fechaServicio,
        );
    }

    @Post()
    create(
        @Req() req: Request & { user: any },
        @Body() dto: CreateAsistenciaDto,
    ) {
        const tenantId = req.user.tenantId;
        return this.asistenciaService.create(tenantId, dto);
    }

    @Patch(':id')
    update(
        @Req() req: Request & { user: any },
        @Param('id') id: string,
        @Body() dto: UpdateAsistenciaDto,
    ) {
        const tenantId = req.user.tenantId;
        return this.asistenciaService.update(tenantId, Number(id), dto);
    }

    @Delete(':id')
    remove(@Req() req: Request & { user: any }, @Param('id') id: string) {
        const tenantId = req.user.tenantId;
        return this.asistenciaService.remove(tenantId, Number(id));
    }
}
