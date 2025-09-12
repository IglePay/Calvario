import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
} from '@nestjs/common';
import { LimpiezaService } from './limpieza.service';

@Controller('limpieza')
export class LimpiezaController {
    constructor(private readonly limpiezaService: LimpiezaService) {}

    // GET /limpieza
    @Get()
    findAll() {
        return this.limpiezaService.findAll();
    }

    // GET /limpieza/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.limpiezaService.findOne(+id);
    }

    // POST /limpieza
    @Post()
    create(
        @Body()
        data: {
            idMiembro: number;
            idTenant: number;
            fechaLimpieza: Date;
        },
    ) {
        return this.limpiezaService.create(data);
    }

    // PATCH /limpieza/:id
    @Patch(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.limpiezaService.update(+id, data);
    }

    // DELETE /limpieza/:id
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.limpiezaService.remove(+id);
    }
}
