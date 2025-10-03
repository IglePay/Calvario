import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    UseGuards,
    Req,
} from '@nestjs/common';
import { LimpiezaService } from './limpieza.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';
import { CreateLimpiezaDto } from './dto/create-limpieza.dto';
import { UpdateLimpiezaDto } from './dto/update-limpieza.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

interface AuthenticatedRequest extends Request {
    user: JwtPayload;
}

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('limpieza')
export class LimpiezaController {
    constructor(private readonly limpiezaService: LimpiezaService) {}

    @Get()
    findAll(@Req() req: AuthenticatedRequest) {
        return this.limpiezaService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
        return this.limpiezaService.findOne(+id, req.user.tenantId);
    }

    @Post()
    create(@Body() dto: CreateLimpiezaDto, @Req() req: AuthenticatedRequest) {
        return this.limpiezaService.create({
            ...dto,
            idTenant: req.user.tenantId,
        });
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateLimpiezaDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return this.limpiezaService.update(+id, {
            ...dto,
            idTenant: req.user.tenantId,
        });
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
        return this.limpiezaService.remove(+id, req.user.tenantId);
    }
}
