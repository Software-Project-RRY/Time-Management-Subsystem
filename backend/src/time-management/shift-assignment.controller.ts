import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ShiftAssignmentService } from './shift-assignment.service';
import { AssignShiftDto, UpdateShiftAssignmentDto } from './dto';

@Controller('shifts')
export class ShiftAssignmentController {
    constructor(private readonly shiftAssignmentService: ShiftAssignmentService) { }

    @Post('assign')
    assignShift(@Body() assignShiftDto: AssignShiftDto) {
        return this.shiftAssignmentService.assignShift(assignShiftDto);
    }

    @Get('my')
    findMyShifts(@Query('employeeId') employeeId: string) {
        // In a real app, employeeId would come from the JWT token
        return this.shiftAssignmentService.findMyShifts(employeeId);
    }

    @Get()
    findAll() {
        return this.shiftAssignmentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shiftAssignmentService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShiftAssignmentDto: UpdateShiftAssignmentDto) {
        return this.shiftAssignmentService.update(id, updateShiftAssignmentDto);
    }
}
