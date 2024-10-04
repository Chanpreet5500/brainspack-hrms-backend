import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { Leaves } from "./schema/leave.schema";
import { LeaveDataDto } from "./dto/leavedata.dto";
import { validateObjectId } from "src/validators/id-validator.validator";
import { Users } from "../user/schemas/user.schema";

@Injectable()
export class LeaveServices {
    constructor(
        @InjectModel(Leaves.name) private LeaveModel: Model<Leaves>,
        @InjectModel(Users.name) private UsersModel: Model<Users>,
    ) { }

    async createleave(createdById: string, leaveData: LeaveDataDto) {
        try {
            validateObjectId(createdById, 'Created By ID');
            const { employee_id, start_date, end_date, reason, leave_type, status } = leaveData;
            const employeeId = new Types.ObjectId(employee_id)
            const totaldays = Math.floor((end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            await this.LeaveModel.create({
                employee_id: employeeId, start_date, end_date, reason, leave_type, status, totaldays: totaldays, createdBy: createdById, updatedBy: createdById
            });
            return { message: ResponseMessages.LEAVE.CREATED }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_CREATE)
        }

    }

    async getAllleaves(page: number, limit: number, search: string) {
        try {
            const searchRegex = new RegExp(search, 'i');
            const users = await this.UsersModel.find({
                $or: [
                    { fname: { $regex: searchRegex } },
                    { lname: { $regex: searchRegex } },
                ]
            });
            const userIds = users.map(user => user._id);
            const query = userIds.length > 0 ? { employee_id: { $in: userIds } } : {};
            const totalleaves = await this.LeaveModel.countDocuments(query)
            const leaves = await this.LeaveModel.find(query).skip((page - 1) * limit).limit(limit).populate('employee_id', 'fname lname email');
            return { totalleaves, leaves }
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_FETCH)
        }

    }

    async getEmployeeLeaves(employeeId: string) {
        try {
            validateObjectId(employeeId, 'Employee ID')
            const leaves = await this.LeaveModel.find({ employee_id: employeeId });
            const totalleaves = leaves.reduce((sum, leave) => sum + (leave.totaldays || 0), 0);
            return { leaves, totalleaves };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_FETCH)
        }

    }

    async updateleave(updatedById: string, leaveId: string, status: string) {

        try {
            validateObjectId(leaveId, 'Leave ID')
            validateObjectId(updatedById, 'Updated By ID')
            const updatedData = {
                status,
                updatedBy: updatedById,
                updatedAt: new Date()
            }
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
}