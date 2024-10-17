import { Body, Controller, Get, Param, Post, Put, } from "@nestjs/common";
import { LeavePolicyServices } from "./leavePolicies.service";
import { LeaveTypeDto } from "./dtos/leaveType.dto";
import { LeavePolicyDto, LeavePolicyUpdateDto } from "./dtos/leavePolicies.dto";



@Controller('api/leave-policies')
export class LeavePolicyController {
    constructor(private readonly LeavePolicyServices: LeavePolicyServices) { }

    @Get('/types')
    async allTypes() {
        return this.LeavePolicyServices.allLeaveTypes()
    }

    @Post('/create-type')
    async createType(@Body() leaveTypeData: LeaveTypeDto) {
        return this.LeavePolicyServices.createType(leaveTypeData)
    }

    @Get('/')
    async allPolicies() {
        return this.LeavePolicyServices.allLeavePolicy()
    }

    @Post('/create')
    async create(@Body() LeavePolicyData: LeavePolicyDto) {
        return this.LeavePolicyServices.createLeavePolicy(LeavePolicyData)
    }

    @Put('/update/:leaveTypeID')
    async update(@Param('leaveTypeID') leaveTypeID: string, @Body() LeavePolicyData: LeavePolicyUpdateDto) {
        return this.LeavePolicyServices.updateLeavePolicy(leaveTypeID, LeavePolicyData)
    }

    @Get('/balance')
    async allBalance() {
        return this.LeavePolicyServices.allLeaveBalance()
    }

}