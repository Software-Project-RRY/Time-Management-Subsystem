import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ShiftTypeService } from './shift-type.service';
import { CreateShiftTypeDto, UpdateShiftTypeDto } from './dto';

@Controller('shift-types')
export class ShiftTypeController {
    constructor(private readonly shiftTypeService: ShiftTypeService) { }

    @Post()
    create(@Body() createShiftTypeDto: CreateShiftTypeDto) {
        return this.shiftTypeService.create(createShiftTypeDto);
    }

    @Get()
    findAll() {
        return this.shiftTypeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shiftTypeService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShiftTypeDto: UpdateShiftTypeDto) {
        return this.shiftTypeService.update(id, updateShiftTypeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.shiftTypeService.remove(id);
    }
}
