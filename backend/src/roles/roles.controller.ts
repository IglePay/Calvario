import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    // Obtener todos los roles
    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get('id/:id')
    findOneById(@Param('id') id: string) {
        return this.rolesService.findOneById(+id);
    }

    // Buscar un rol por nombre
    @Get(':nombre')
    findOneByName(@Param('nombre') nombre: string) {
        return this.rolesService.findOneByName(nombre);
    }
}
