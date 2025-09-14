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

@UseGuards(AuthGuard)
@Controller('grupos')
export class GrupoController {
    constructor(private readonly grupoService: GrupoService) {}

    @Post()
    create(@Body() dto: CreateGrupoDto, @Req() req) {
        const tenantId = req.user?.tenantId; // 👈 cambiar a tenantId

        if (!tenantId) {
            throw new UnauthorizedException('Usuario sin tenant');
        }

        return this.grupoService.create({
            ...dto,
            idTenant: tenantId,
        });
    }

    @Get()
    findAll() {
        return this.grupoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.grupoService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGrupoDto: UpdateGrupoDto) {
        return this.grupoService.update(+id, updateGrupoDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.grupoService.remove(+id);
    }
}
