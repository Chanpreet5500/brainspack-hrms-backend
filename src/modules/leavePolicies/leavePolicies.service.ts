import { ConflictException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { LeaveTypeDto } from "./dtos/leaveType.dto";
import { LeaveTypes } from "./schemas/leaveTypes.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { LeavePolicyDto, LeavePolicyUpdateDto } from "./dtos/leavePolicies.dto";
import { LeavePolicies } from "./schemas/leavePolicies.schema";
import { LeaveBalance } from "./schemas/leaveBalance.schema";
import { Cron } from "@nestjs/schedule";


@Injectable()
export class LeavePolicyServices {
    constructor(
        @InjectModel(LeaveTypes.name) private leaveTypeModel: Model<LeaveTypes>,
        @InjectModel(LeavePolicies.name) private leavePolicyModel: Model<LeavePolicies>,
        @InjectModel(LeaveBalance.name) private leaveBalanceModel: Model<LeaveBalance>,
    ) { }

    async allLeaveTypes() {
        try {
            const leaveTypes = await this.leaveTypeModel.find();
            return leaveTypes
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.LEAVETYPE.FAILED_FETCH)
        }
    }

    async createType(leaveTypeData: LeaveTypeDto) {
        try {
            const { name, description } = leaveTypeData;
            const existingType = await this.leaveTypeModel.findOne({ name });
            if (existingType) {
                throw new ConflictException(ResponseMessages.LEAVETYPE.TYPE_ALREADY_EXISTS);
            }
            const leaveType = await this.leaveTypeModel.create({
                name, description
            });
            return { message: ResponseMessages.LEAVETYPE.CREATED, leaveTypeId: leaveType._id }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.LEAVETYPE.FAILED_CREATE)
        }
    }

    async allLeavePolicy() {
        try {
            const policies = await this.leavePolicyModel.find().populate('leave_type_id', 'name description');
            return policies
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.LEAVEPOLICY.FAILED_FETCH)
        }

    }

    async createLeavePolicy(LeavePolicyData: LeavePolicyDto) {
        try {
            const { leave_type_id, max_leaves_per_year, max_leaves } = LeavePolicyData;

            const leaveTypeId = new Types.ObjectId(leave_type_id)

            const existingPolicy = await this.leavePolicyModel.findOne({ leave_type_id });

            if (existingPolicy) {
                throw new ConflictException(ResponseMessages.LEAVEPOLICY.POLICIY_ALREADY_EXISTS);
            }

            const leavePolicy = await this.leavePolicyModel.create({
                leave_type_id: leaveTypeId, max_leaves_per_year, max_leaves
            });

            return { message: ResponseMessages.LEAVEPOLICY.CREATED, leavePolicyId: leavePolicy._id }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.LEAVEPOLICY.FAILED_CREATE)
        }


    }

    async updateLeavePolicy(leaveTypeID: string, LeavePolicyData: LeavePolicyUpdateDto) {
        try {
            const updatedPolicyData = {
                ...LeavePolicyData,
                updatedAt: new Date()
            }
            const leaveTypeId = new Types.ObjectId(leaveTypeID);
            const existingPolicy = await this.leavePolicyModel.findOne({ leave_type_id: new Types.ObjectId(leaveTypeID) });
            if (!existingPolicy) {
                return { message: ResponseMessages.LEAVEPOLICY.NOT_FOUND };
            }
            const updatedPolicy = await this.leavePolicyModel.findOneAndUpdate(
                { leave_type_id: leaveTypeId },
                updatedPolicyData,
                { new: true }
            );
            return { message: ResponseMessages.LEAVEPOLICY.UPDATED, updatedpolicy: updatedPolicy }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.LEAVEPOLICY.FAILED_UPDATE)
        }
    }

    async allLeaveBalance() {
        try {
            const leaveBalance = await this.leaveBalanceModel.find().populate('leave_type_id', 'name description').populate('user_id', 'fname lname email');
            return leaveBalance
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.LEAVEBALANCE.FAILED_FETCH)
        }

    }

    async createUserBalance(userId: string) {
        const leavePolicies = await this.leavePolicyModel.find().select('leave_type_id max_leaves').exec();
        for (const policy of leavePolicies) {
            const leaveBalance = new this.leaveBalanceModel({
                user_id: userId,
                leave_type_id: policy.leave_type_id,
                total_allocated: policy.max_leaves,
            });
            await leaveBalance.save();
        }
    }

    async deleteUserBalance(userId: string) {
        const result = await this.leaveBalanceModel.deleteMany({ user_id: userId });

        if (result.deletedCount > 0) {
            console.log(`Successfully deleted ${result.deletedCount} leave balance records for user: ${userId}`);
        } else {
            console.log(`No leave balance records found for user: ${userId}`);
        }
    }

    async addLeaveInBalance(leaveId: string, userId: string, totaldays: number) {
        try {
            const leaveBalance = await this.leaveBalanceModel.findOne({
                leave_type_id: leaveId,
                user_id: userId,
            });

            if (leaveBalance) {
                leaveBalance.total_used += totaldays;
                await leaveBalance.save();
                console.log('Leave balance updated successfully.');
            } else {
                console.log('Leave balance entry not found.');
            }
        } catch (error) {
            console.error('Error updating leave balance:', error);
        }
    }

    async removeLeaveInBalance(leaveId: string, userId: string, totaldays: number) {
        try {
            const leaveBalance = await this.leaveBalanceModel.findOne({
                leave_type_id: leaveId,
                user_id: userId,
            });

            if (leaveBalance && leaveBalance.total_used > 0) {
                const updatedBalance = leaveBalance.total_used - totaldays;
                leaveBalance.total_used = updatedBalance;
                await leaveBalance.save();
                console.log('Leave balance updated successfully.');
            } else {
                console.log('Leave balance entry not found.');
            }
        } catch (error) {
            console.error('Error updating leave balance:', error);
        }
    }

    @Cron('0 0 0 1 1 *')
    async resetTotalUsed() {
        try {
            await this.leaveBalanceModel.updateMany({}, { 'total_used': 0 });
            console.log('Total used leaves reset to 0 for all records');
        } catch (error) {
            console.error('Error resetting total used leaves:', error);
        }
    }
}

