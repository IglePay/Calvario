import { Controller, Get, Param, Query } from '@nestjs/common';
import { GeneroService } from './genero.service';

@Controller('genero')
export class GeneroController {
    constructor(private generoService: GeneroService) {}

    // Obtener todos los géneros
    @Get()
    findAll() {
        return this.generoService.findAll();
    }

    // Buscar un género por ID
    @Get('id/:id')
    findOneById(@Param('id') id: string) {
        return this.generoService.findOneById(+id);
    }

    // Buscar un género por nombre
    @Get('nombre/:nombre')
    findOneByName(@Param('nombre') nombre: string) {
        return this.generoService.findOneByName(nombre);
    }

    // Buscar géneros con paginación
    // @Get('pagina')
    // findWithPagination(
    //     @Query('page') page: string,
    //     @Query('limit') limit: string,
    // ) {
    //     const pageNumber = parseInt(page, 10) || 1;
    //     const limitNumber = parseInt(limit, 10) || 10;
    //     return this.generoService.findWithPagination(pageNumber, limitNumber);
    // }
}
