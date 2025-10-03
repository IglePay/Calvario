import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('tenants')
export class TenantsController {
    constructor(private tenantsService: TenantsService) {}

    @Get()
    // @Permissions('ver_tenant')
    findAll() {
        return this.tenantsService.findAll();
    }

    @Get('id/:id')
    findOneById(@Param('id') id: string) {
        return this.tenantsService.findOneById(+id);
    }

    @Post()
    create(@Body() data: CreateTenantDto) {
        return this.tenantsService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateTenantDto) {
        return this.tenantsService.update(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tenantsService.remove(+id);
    }
}
