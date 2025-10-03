import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    UnauthorizedException,
} from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('grupos')
export class GrupoController {
    constructor(private readonly grupoService: GrupoService) {}

    @Get()
    findAll(@Req() req) {
        return this.grupoService.findAllByTenant(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        return this.grupoService.findOneByTenant(+id, req.user.tenantId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateGrupoDto, @Req() req) {
        return this.grupoService.updateByTenant(+id, dto, req.user.tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
        return this.grupoService.removeByTenant(+id, req.user.tenantId);
    }

    @Post()
    create(@Body() dto: CreateGrupoDto, @Req() req) {
        return this.grupoService.create({
            ...dto,
            idTenant: req.user.tenantId,
        });
    }
}
