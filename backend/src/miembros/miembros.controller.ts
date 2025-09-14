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

import { MiembrosService } from './miembros.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('miembros')
export class MiembrosController {
    constructor(private readonly miembrosService: MiembrosService) {}

    @Post()
    create(@Body() createMiembroDto: any) {
        const tenantId = 1;
        return this.miembrosService.create(createMiembroDto, tenantId);
    }

    @Get()
    findAll() {
        return this.miembrosService.findAll();
    }

    @Get('id/:id')
    findOne(@Param('id') id: string) {
        return this.miembrosService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMiembroDto: any) {
        return this.miembrosService.update(+id, updateMiembroDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.miembrosService.remove(+id);
    }
}
