import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Req,
} from '@nestjs/common';
import { LimpiezaService } from './limpieza.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';
import { CreateLimpiezaDto } from './dto/create-limpieza.dto';
import { UpdateLimpiezaDto } from './dto/update-limpieza.dto';

@UseGuards(AuthGuard)
@Controller('limpieza')
export class LimpiezaController {
    constructor(private readonly limpiezaService: LimpiezaService) {}

    @Get()
    findAll(@Req() req: Request) {
        if (!req.user?.tenantId)
            throw new Error('TenantId no encontrado en usuario autenticado');
        const idTenant = req.user.tenantId;
        return this.limpiezaService.findAll(idTenant);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: Request) {
        if (!req.user?.tenantId)
            throw new Error('TenantId no encontrado en usuario autenticado');
        const idTenant = req.user.tenantId;
        return this.limpiezaService.findOne(+id, idTenant);
    }

    @Post()
    create(@Body() dto: CreateLimpiezaDto, @Req() req: Request) {
        if (!req.user?.tenantId)
            throw new Error('TenantId no encontrado en usuario autenticado');
        const idTenant = req.user.tenantId;
        return this.limpiezaService.create({ ...dto, idTenant });
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateLimpiezaDto,
        @Req() req: Request,
    ) {
        if (!req.user?.tenantId)
            throw new Error('TenantId no encontrado en usuario autenticado');
        const idTenant = req.user.tenantId;
        return this.limpiezaService.update(+id, { ...dto, idTenant });
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request) {
        if (!req.user?.tenantId)
            throw new Error('TenantId no encontrado en usuario autenticado');
        const idTenant = req.user.tenantId;
        return this.limpiezaService.remove(+id, idTenant);
    }
}
