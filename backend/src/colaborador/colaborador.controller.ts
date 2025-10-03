import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ColaboradorService } from './colaborador.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('colaborador')
export class ColaboradorController {
    constructor(private readonly service: ColaboradorService) {}

    @Get()
    @Permissions('ver_colaborador')
    async findAll(@Req() req: any) {
        const tenantId = req.user.tenantId;
        return this.service.findAll(tenantId);
    }

    @Get('roles')
    async findRoles() {
        return this.service.findRoles();
    }

    @Post()
    async create(
        @Body()
        body: { name: string; email: string; password: string; roleId: number },
        @Req() req: any,
    ) {
        const tenantId = req.user.tenantId;
        return this.service.createUser(body, tenantId);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body()
        body: {
            name?: string;
            email?: string;
            password?: string;
            roleId?: number;
        },
    ) {
        return this.service.updateUser(+id, body);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.service.deleteUser(+id);
    }
}
