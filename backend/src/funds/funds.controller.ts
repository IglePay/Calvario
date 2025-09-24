import {
    Controller,
    Get,
    Req,
    UseGuards,
    Query,
    Post,
    Body,
    Delete,
    Patch,
    Param,
} from '@nestjs/common';
import { FundsService } from './funds.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';

@UseGuards(AuthGuard)
@Controller('funds')
export class FundsController {
    constructor(private readonly fundsService: FundsService) {}

    @Get()
    findAll(
        @Req() req: any,
        @Query('page') page = '1',
        @Query('limit') limit = '10',
        @Query('search') search = '',
    ) {
        const tenantId = req.user.tenantId;
        return this.fundsService.findAll(
            tenantId,
            Number(page),
            Number(limit),
            search,
        );
    }

    @Post()
    create(@Req() req: any, @Body() dto: CreateFundDto) {
        const tenantId = req.user.tenantId;
        return this.fundsService.create(tenantId, dto);
    }

    @Patch(':id')
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateFundDto,
    ) {
        const tenantId = req.user.tenantId;
        return this.fundsService.update(Number(id), tenantId, dto);
    }

    @Delete(':id')
    delete(@Req() req: any, @Param('id') id: string) {
        const tenantId = req.user.tenantId;
        return this.fundsService.delete(Number(id), tenantId);
    }

    @Post('restore/:id')
    restore(@Req() req: any, @Param('id') id: string) {
        const tenantId = req.user.tenantId;
        return this.fundsService.restore(Number(id), tenantId);
    }
}
