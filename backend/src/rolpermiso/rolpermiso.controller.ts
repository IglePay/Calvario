import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
    Query,
} from '@nestjs/common';
import { RolPermisoService } from './rolpermiso.service';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaService } from 'prisma/prisma.service';

@UseGuards(AuthGuard)
@Controller('rolpermiso')
export class RolPermisoController {
    constructor(private readonly rolPermisoService: RolPermisoService) {}

    // GET /rolpermiso/roles -> listar todos los roles
    @Get('roles')
    async getRoles(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search: string,
    ) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        return this.rolPermisoService.getAllRoles({
            page: pageNum,
            limit: limitNum,
            search: search || '',
        });
    }

    // GET /rolpermiso/permisos -> obtener todos los permisos disponibles
    @Get('permisos')
    async getAllPermisos() {
        return this.rolPermisoService.getAllPermisos();
    }

    @Get('roles-con-permisos')
    async getRolesConPermisos(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search: string,
    ) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        return this.rolPermisoService.getAllRolesWithPermisos({
            page: pageNum,
            limit: limitNum,
            search: search || '',
        });
    }

    // POST /rolpermiso/permisos -> crear nuevo permiso
    @Post('permisos')
    async createPermiso(@Body() body: { nombre: string; descripcion: string }) {
        return this.rolPermisoService.createPermiso(
            body.nombre,
            body.descripcion,
        );
    }

    // POST /rolpermiso/rol/:roleId/permiso/:permisoId -> asignar permiso a un rol
    @Post('rol/:roleId/permiso/:permisoId')
    async assignPermisoToRol(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Param('permisoId', ParseIntPipe) permisoId: number,
    ) {
        return this.rolPermisoService.assignPermisoToRol(roleId, permisoId);
    }

    // PATCH /rolpermiso/rol/:roleId -> actualizar permisos de un rol
    @Patch('rol/:roleId')
    async updatePermisosRol(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Body('permisos') permisos: string[],
    ) {
        return this.rolPermisoService.updatePermisosRol(roleId, permisos);
    }
}
