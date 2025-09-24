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
    Query,
} from '@nestjs/common';
import { NomeclaturaService } from './nomeclatura.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateNomeclaturaDto } from './dto/create-nomeclatura.dto';
import { UpdateNomeclaturaDto } from './dto/update-nomeclatura.dto';

@UseGuards(AuthGuard)
@Controller('nomeclatura')
export class NomeclaturaController {
    constructor(private readonly nomeclaturaService: NomeclaturaService) {}

    @Get()
    findAll(
        @Req() req: any,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        const tenantId = req.user.tenantId;
        return this.nomeclaturaService.findAll(
            tenantId,
            Number(page),
            Number(limit),
        );
    }

    @Get('simple')
    findSimple(@Req() req: any) {
        const tenantId = req.user.tenantId;
        return this.nomeclaturaService.findSimple(tenantId);
    }

    @Post()
    create(@Req() req: any, @Body() dto: CreateNomeclaturaDto) {
        const tenantId = req.user.tenantId;
        return this.nomeclaturaService.create(tenantId, dto);
    }

    @Patch(':id')
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateNomeclaturaDto,
    ) {
        const tenantId = req.user.tenantId;
        return this.nomeclaturaService.update(Number(id), tenantId, dto);
    }

    @Delete(':id')
    remove(@Req() req: any, @Param('id') id: string) {
        const tenantId = req.user.tenantId;
        return this.nomeclaturaService.remove(Number(id), tenantId);
    }
}
