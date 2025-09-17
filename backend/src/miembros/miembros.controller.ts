import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { MiembrosService } from './miembros.service';
import { CreateMiembroDto } from './dto/create.miembro.dto';

@UseGuards(AuthGuard)
@Controller('miembros')
export class MiembrosController {
    constructor(private readonly miembrosService: MiembrosService) {}

    // Obtener todos los miembros (con relaciones)
    @Get()
    async getAll(@Req() req) {
        const idTenant = req.user.tenantId; // tenant del usuario logueado
        return this.miembrosService.findAllForTenant(idTenant);
    }

    // Obtener datos solo para tabla
    @Get('table')
    async getAllForTable(@Req() req) {
        const idTenant = req.user.tenantId;
        return this.miembrosService.findAllForTableForTenant(idTenant);
    }

    // Obtener bautizados para select
    @Get('bautizados')
    async getBautizados(@Req() req) {
        const idTenant = req.user.tenantId;
        return this.miembrosService.getBautizados(idTenant);
    }

    // Obtener servidores para select
    @Get('servidores')
    async getServidores(@Req() req) {
        const idTenant = req.user.tenantId;
        return this.miembrosService.getServidores(idTenant);
    }

    // Crear miembro
    @Post()
    async create(@Body() dto: CreateMiembroDto, @Req() req) {
        const idTenant = req.user.tenantId;
        return this.miembrosService.createMiembro(dto, idTenant);
    }

    // Editar miembro
    @Patch(':idMiembro')
    async update(
        @Param('idMiembro') idMiembro: string,
        @Body() dto: CreateMiembroDto,
        @Req() req,
    ) {
        const idTenant = req.user.tenantId;
        return this.miembrosService.updateMiembro(
            Number(idMiembro),
            dto,
            idTenant,
        );
    }
}
