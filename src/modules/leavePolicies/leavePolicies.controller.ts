import { Body, Controller, Get, Param, Post, Put, UseGuards, } from "@nestjs/common";
import { LeavePolicyServices } from "./leavePolicies.service";
import { LeaveTypeDto, UpdateLeaveTypeDto } from "./dtos/leaveType.dto";
import { LeavePolicyDto, LeavePolicyUpdateDto } from "./dtos/leavePolicies.dto";
import { AuthGuard } from "@nestjs/passport";



@Controller('api/leave-policies')
export class LeavePolicyController {
    constructor(private readonly LeavePolicyServices: LeavePolicyServices) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/types')
    async allTypes() {
        return this.LeavePolicyServices.allLeaveTypes()
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/create-type')
    async createType(@Body() leaveTypeData: LeaveTypeDto) {
        return this.LeavePolicyServices.createType(leaveTypeData)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/update-type/:leaveTypeID')
    async UpdateType(@Param('leaveTypeID') leaveTypeID: string, @Body() leaveTypeData: UpdateLeaveTypeDto) {
        return this.LeavePolicyServices.updateType(leaveTypeID, leaveTypeData)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async allPolicies() {
        return this.LeavePolicyServices.allLeavePolicy()
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
    async create(@Body() LeavePolicyData: LeavePolicyDto) {
        return this.LeavePolicyServices.createLeavePolicy(LeavePolicyData)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/update/:leavePolicyID')
    async update(@Param('leavePolicyID') leavePolicyID: string, @Body() LeavePolicyData: LeavePolicyUpdateDto) {
        return this.LeavePolicyServices.updateLeavePolicy(leavePolicyID, LeavePolicyData)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/balance')
    async allBalance() {
        return this.LeavePolicyServices.allLeaveBalance()
    }

}