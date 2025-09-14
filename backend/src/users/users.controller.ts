import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('full')
    async findAllFull() {
        return this.usersService.findAllWithDetails();
    }

    @Get(':email')
    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @Get('roles')
    async findRoles() {
        return this.usersService.findRoles();
    }

    @Get('tenants')
    async findTenants() {
        return this.usersService.findTenants();
    }

    @Post()
    async create(
        @Body()
        body: {
            name: string;
            email: string;
            password: string;
            roleId: number;
            tenantId: number;
        },
    ) {
        return this.usersService.createUser(body);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body()
        data: {
            name?: string;
            email?: string;
            password?: string;
            roleId?: number;
            tenantId?: number;
        },
    ) {
        // Llama al servicio que maneja la actualización
        return this.usersService.updateUser(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.deleteUser(+id);
    }
}
