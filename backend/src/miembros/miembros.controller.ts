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
    Query,
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

    // Obtener datos solo para tabla miembros
    @Get('table')
    async getAllForTable(
        @Req() req: Request & { user: any },
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        const idTenant = req.user.tenantId;
        return this.miembrosService.findAllForTableForTenant(
            idTenant,
            Number(page),
            Number(limit),
            search,
        );
    }

    // miembros.controller.ts
    @Get('asignar-rolportenant')
    async getUsuariosByRolForTenant(
        @Req() req: any,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
    ) {
        console.log('REQ.USER:', req.user); // <-- verifica el usuario del JWT
        console.log('Query Params:', { page, limit, search });
        const roleId = req.user.roleId;
        return this.miembrosService.getUsuariosByRolForTenant(
            roleId,
            Number(page),
            Number(limit),
            search,
        );
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

    @Get('estadisticas')
    async getEstadisticas(@Req() req: any) {
        const tenantId = req.user.tenantId;
        return this.miembrosService.getEstadisticas(tenantId);
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
