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
import { GrupoService } from './grupo.service';

@Controller('grupos')
export class GrupoController {
    constructor(private readonly grupoService: GrupoService) {}

    @Post()
    create(@Body() createGrupoDto: any) {
        return this.grupoService.create(createGrupoDto);
    }

    @Get()
    findAll() {
        return this.grupoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.grupoService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGrupoDto: any) {
        return this.grupoService.update(+id, updateGrupoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.grupoService.remove(+id);
    }
}
