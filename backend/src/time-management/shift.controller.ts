import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto, UpdateShiftDto } from './dto';

@Controller('shift-definitions')
export class ShiftController {
    constructor(private readonly shiftService: ShiftService) { }

    @Post()
    create(@Body() createShiftDto: CreateShiftDto) {
        return this.shiftService.create(createShiftDto);
    }

    @Get()
    findAll() {
        return this.shiftService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shiftService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
        return this.shiftService.update(id, updateShiftDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.shiftService.remove(id);
    }
}
