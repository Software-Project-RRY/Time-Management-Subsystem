import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ScheduleRuleService } from './schedule-rule.service';
import { CreateScheduleRuleDto, UpdateScheduleRuleDto } from './dto';

@Controller('schedule-rules')
export class ScheduleRuleController {
    constructor(private readonly scheduleRuleService: ScheduleRuleService) { }

    @Post()
    create(@Body() createScheduleRuleDto: CreateScheduleRuleDto) {
        return this.scheduleRuleService.create(createScheduleRuleDto);
    }

    @Get()
    findAll() {
        return this.scheduleRuleService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.scheduleRuleService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateScheduleRuleDto: UpdateScheduleRuleDto) {
        return this.scheduleRuleService.update(id, updateScheduleRuleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.scheduleRuleService.remove(id);
    }
}
