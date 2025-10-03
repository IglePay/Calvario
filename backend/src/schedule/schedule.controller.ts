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
import { ScheduleService } from './schedule.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateSchedulerDto } from './dto/create-schedule.dto';
import { UpdateSchedulerDto } from './dto/update-schedule.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('service')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    @Get()
    @Permissions('ver_horario')
    findAll(@Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.scheduleService.findAll(tenantId);
    }

    @Post()
    create(
        @Body() dto: CreateSchedulerDto,
        @Req() req: Request & { user: any },
    ) {
        const tenantId = req.user.tenantId;
        return this.scheduleService.create(dto, tenantId);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateSchedulerDto,
        @Req() req: Request & { user: any },
    ) {
        const tenantId = req.user.tenantId;
        return this.scheduleService.update(+id, dto, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request & { user: any }) {
        const tenantId = req.user.tenantId;
        return this.scheduleService.remove(+id, tenantId);
    }
}
