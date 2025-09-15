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
} from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('actividades')
export class ActividadController {
    constructor(private readonly actividadService: ActividadService) {}

    @Get()
    findAll(@Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.actividadService.findAll(tenantId);
    }

    @Get('miembros')
    findAllMiembros(@Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.actividadService.findAllMiembros(tenantId);
    }

    @Get('grupos')
    findAllGrupos(@Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.actividadService.findAllGrupos(tenantId);
    }

    @Post()
    create(
        @Body() createActividadDto: CreateActividadDto,
        @Req() req: Request & { user: any },
    ) {
        const tenantId = req.user.tenantId;
        return this.actividadService.create(createActividadDto, tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.actividadService.findOne(+id, tenantId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateActividadDto: UpdateActividadDto,
        @Req() req: Request & { user: any },
    ) {
        const tenantId = req.user.tenantId;
        return this.actividadService.update(+id, updateActividadDto, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.actividadService.remove(+id, tenantId);
    }
}
