import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { LeaveDataDto } from "./dto/leavedata.dto";
import { LeaveServices } from "./leave.service";
import { ResponseMessages } from "src/utils/responseMessages";


@Controller('api/leaves')
export class LeaveController {
    constructor(private readonly leaveServices: LeaveServices) { }

    @Get('/:page?/:limit?/:search?')
    async getLeaves(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
        return this.leaveServices.getAllleaves(page, limit, search)
    }

    @Get('/:employeeid')
    async getEmployeeLeaves(@Param('employeeid') employeeId: string) {
        return this.leaveServices.getEmployeeLeaves(employeeId)
    }

    @Post('/:createdby')
    async create(@Param('createdby') createdById: string, @Body() leavedata: LeaveDataDto) {
        return this.leaveServices.createleave(createdById, leavedata)
    }

    @Patch('update/:updatedby/:leaveid/:status?')
    async update(@Param('updatedby') updatedById: string,
        @Param('leaveid') leaveId: string,
        @Query('status') status: string) {
        if (status !== 'approved' && status !== 'rejected') {
            throw new BadRequestException(ResponseMessages.LEAVE.INVALID_STATUS);
        }
        return this.leaveServices.updateleave(updatedById, leaveId, status)
    }

}