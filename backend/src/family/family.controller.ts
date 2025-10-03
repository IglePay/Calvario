import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { FamilyService } from './family.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('family')
export class FamilyController {
    constructor(private readonly familyService: FamilyService) {}

    @Get()
    @Permissions('ver_familias')
    findAll(@Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.familyService.findAll(tenantId);
    }

    @Post()
    create(@Body() dto: CreateFamilyDto, @Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.familyService.create(dto, tenantId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateFamilyDto,
        @Req() req: Request & { user: any },
    ) {
        const tenantId = req.user.tenantId;
        return this.familyService.update(+id, dto, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.familyService.remove(+id, tenantId);
    }
}
