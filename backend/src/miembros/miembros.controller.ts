import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Req,
    UseGuards,
    Delete,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { MiembrosService } from './miembros.service';
import { CreateMiembroDto } from './dto/create.miembro.dto';
import { UpdateMiembroDto } from './dto/update.miembro.dto';

@UseGuards(AuthGuard)
@Controller('miembros')
export class MiembrosController {
    constructor(private readonly miembrosService: MiembrosService) {}

    @Get()
    findAll(@Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.miembrosService.findAllForTenant(tenantId);
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
        @Body() dto: UpdateMiembroDto,
        @Req() req,
    ) {
        const idTenant = req.user.tenantId;
        return this.miembrosService.updateMiembro(
            Number(idMiembro),
            dto,
            idTenant,
        );
    }

    @Delete(':idMiembro')
    async remove(@Param('idMiembro') idMiembro: string, @Req() req) {
        const idTenant = req.user.tenantId;
        return this.miembrosService.deleteMiembro(Number(idMiembro), idTenant);
    }
}
