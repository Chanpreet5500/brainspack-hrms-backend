import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { Leaves } from "./schema/leave.schema";
import { LeaveDataDto } from "./dto/leavedata.dto";
import { validateObjectId } from "src/validators/id-validator.validator";
import { STATUSTYPE } from "src/utils/constant";
import { LeavePolicyServices } from "../leavePolicies/leavePolicies.service";
import { calculateTotalDay } from "src/helpers/calculateLeaveDay.helper";
import { UserServices } from "../user/user.service";

type statusType = typeof STATUSTYPE[number];
@Injectable()
export class LeaveServices {
    constructor(
        @InjectModel(Leaves.name) private LeaveModel: Model<Leaves>,
        private readonly leavePolicyServices: LeavePolicyServices,
        private readonly userService: UserServices
    ) { }

    async createleave(createdById: string, leaveData: LeaveDataDto) {
        try {
            validateObjectId(createdById, 'Created By ID');
            const { employee_id, start_date, end_date, reason, leave_type_id, start_day, end_day, start_half_day_time,
                end_half_day_time } = leaveData;
            const employeeId = new Types.ObjectId(employee_id)
            const leaveTypeId = new Types.ObjectId(leave_type_id)
            let totalDays = calculateTotalDay(start_date, end_date);
            if (start_day == 'half') {
                totalDays -= 0.5
            }
            if (end_day == 'half') {
                totalDays -= 0.5
            }
            const leaveDataToCreate = {
                employee_id: employeeId,
                start_date,
                end_date,
                reason,
                leave_type_id: leaveTypeId,
                totaldays: totalDays,
                createdBy: createdById,
                updatedBy: createdById,
                start_day,
                end_day,
                start_half_day_time: start_day === 'half' ? start_half_day_time : undefined,
                end_half_day_time: end_day === 'half' ? end_half_day_time : undefined,
            }
            await this.LeaveModel.create(leaveDataToCreate);
            return { message: ResponseMessages.LEAVE.CREATED, days: totalDays }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_CREATE)
        }

    }

    async getAllleaves(page: number, limit: number, search: string) {
        try {
            const users = await this.userService.findUsersBySearch(search);
            const userIds = users.map(user => user._id);
            const query = userIds.length > 0 ? { employee_id: { $in: userIds } } : {};
            const totalLeaves = await this.LeaveModel.countDocuments(query);
            const leaves = await this.LeaveModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('employee_id', 'fname lname email')
                .populate('leave_type_id', 'description');

            return { totalLeaves, leaves };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch leaves');
        }
    }

    async getEmployeeLeaves(employeeId: string) {
        try {
            validateObjectId(employeeId, 'Employee ID')
            const leaves = await this.LeaveModel.find({ employee_id: employeeId }).populate('employee_id', 'fname lname email').populate('leave_type_id', 'description');
            const totalleaves = leaves.reduce((sum, leave) => sum + (leave.totaldays || 0), 0);
            return { leaves, totalleaves };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_FETCH)
        }

    }

    async updateleave(updatedById: string, leaveId: string, status: statusType) {

        try {
            validateObjectId(leaveId, 'Leave ID')
            validateObjectId(updatedById, 'Updated By ID')

            const updatedData = {
                status,
                updatedBy: updatedById,
                updatedAt: new Date()
            }
            await this.handleStatusChange(leaveId, status);
            const updatedLeave = await this.LeaveModel.findByIdAndUpdate(leaveId, updatedData, {
                new: true,
            });
            if (!updatedLeave) {
                throw new NotFoundException(ResponseMessages.GENERAL.NOT_FOUND);
            }


            return { message: ResponseMessages.LEAVE.UPDATED };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_UPDATE)
        }

    }

    private async handleStatusChange(leaveId: string, newstatus: statusType) {
        const existingLeave = await this.LeaveModel.findById(leaveId);
        if (!existingLeave) {
            throw new NotFoundException(ResponseMessages.GENERAL.NOT_FOUND);
        }
        const { leave_type_id, employee_id, totaldays, status } = existingLeave;
        if (newstatus === 'approved') {
            await this.leavePolicyServices.addLeaveInBalance(leave_type_id, employee_id, totaldays);
        } else if (status === 'approved' && newstatus === 'rejected') {
            await this.leavePolicyServices.removeLeaveInBalance(leave_type_id, employee_id, totaldays);
        }
    }

    async deleteLeavesByEmployeeId(employeeId: string) {
        const employeeObjectId = new Types.ObjectId(employeeId);
        const result = await this.LeaveModel.deleteMany({ employee_id: employeeObjectId });
        if (result.deletedCount > 0) {
            console.log(`Successfully deleted ${result.deletedCount} leave records for employee: ${employeeId}`);
        } else {
            console.log(`No leave records found for employee: ${employeeId}`);
        }
    }

}
