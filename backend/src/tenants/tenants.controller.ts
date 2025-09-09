import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
    constructor(private tenantsService: TenantsService) {}

    @Get()
    findAll() {
        return this.tenantsService.findAll();
    }

    @Get('id/:id')
    findOneById(@Param('id') id: string) {
        return this.tenantsService.findOneById(+id);
    }

    @Post()
    create(@Body() data: any) {
        return this.tenantsService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.tenantsService.update(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tenantsService.remove(+id);
    }
}
