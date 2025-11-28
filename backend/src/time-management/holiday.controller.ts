import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto, UpdateHolidayDto } from './dto';

@Controller('holidays')
export class HolidayController {
    constructor(private readonly holidayService: HolidayService) { }

    @Post()
    create(@Body() createHolidayDto: CreateHolidayDto) {
        return this.holidayService.create(createHolidayDto);
    }

    @Get()
    findAll() {
        return this.holidayService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.holidayService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
        return this.holidayService.update(id, updateHolidayDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.holidayService.remove(id);
    }
}
