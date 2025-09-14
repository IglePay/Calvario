import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EstadoCivilService } from './estado-civil.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('estado-civil')
export class EstadoCivilController {
    constructor(private estadoCivilService: EstadoCivilService) {}

    // Obtener todos los estados civiles
    @Get()
    findAll() {
        return this.estadoCivilService.findAll();
    }

    // Buscar un estado civil por ID
    @Get('id/:id')
    findOneById(@Param('id') id: string) {
        return this.estadoCivilService.findOneById(+id);
    }

    // Buscar un estado civil por nombre
    @Get('nombre/:nombre')
    findOneByName(@Param('nombre') nombre: string) {
        return this.estadoCivilService.findOneByName(nombre);
    }

    // Buscar estados civiles con paginación
    // @Get('pagina')
    // findWithPagination(
    //     @Query('page') page:string,
    //     @Query('limit') limit:string,
    // ){
    //     const pageNumber = parseInt(page,10) || 1;
    //     const limitNumber = parseInt(limit,10) || 10;
    //     return this.estadoCivilService.findWithPagination(pageNumber,limitNumber);
    // }
}
