import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('actividades')
export class ActividadController {
    constructor(private readonly actividadService: ActividadService) {}

    @Post()
    create(@Body() createActividadDto: any) {
        return this.actividadService.create(createActividadDto);
    }

    @Get()
    findAll() {
        return this.actividadService.findAll();
    }

    @Get('miembros')
    findAllMiembros() {
        return this.actividadService.findAllMiembros();
    }

    @Get('grupos')
    findAllGrupos() {
        return this.actividadService.findAllGrupos();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.actividadService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateActividadDto: any) {
        return this.actividadService.update(+id, updateActividadDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.actividadService.remove(+id);
    }
}
