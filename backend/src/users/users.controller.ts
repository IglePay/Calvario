import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':email')
    findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @Post()
    create(
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
}
