import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UserDataDto } from "./dtos/userdata.dto";
import { UserUpdateDataDto } from "./dtos/userdata.dto"
import { InjectModel } from "@nestjs/mongoose";
import { Users } from "./schemas/user.schema";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { validateObjectId } from "src/validators/id-validator.validator";
import { LeavePolicyServices } from "../leavePolicies/leavePolicies.service";
import { Leaves } from "../leave/schema/leave.schema";
// import { LeaveServices } from "../leave/leave.service";

@Injectable()
export class UserServices {
    constructor(
        @InjectModel(Users.name) private UsersModel: Model<Users>,
        @InjectModel(Users.name) private LeaveModel: Model<Leaves>,
        private readonly leavePolicyServices: LeavePolicyServices,
        // private readonly leaveServices: LeaveServices
    ) { }

    async createUser(userData: UserDataDto, createdById: string) {
        try {
            validateObjectId(createdById, 'Created By ID');
            const { fname, lname, email, role, department } = userData;
            const existingUser = await this.UsersModel.findOne({ email });
            if (existingUser) {
                throw new ConflictException(ResponseMessages.GENERAL.EMAIL_ALREADY_EXISTS);
            }
            const createdUser = await this.UsersModel.create({
                fname, lname, email, role, department, createdBy: createdById, updatedBy: createdById
            });
            await this.leavePolicyServices.createUserBalance(createdUser._id as string)
            return { message: ResponseMessages.USER.CREATED, userId: createdUser._id }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_CREATE)
        }

    }

    async getUsers(page: number, limit: number, search: string) {
        try {
            const users = await this.findUsersBySearch(search);
            const activeUsers = users.filter(user => !user.isDeleted);
            const totalusers = users.length;
            if (!page || !limit) {
                const allUsers = activeUsers.map(user => ({
                    _id: user._id,
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                }));
                return { totalusers, users: allUsers };
            }
            const paginatedUsers = activeUsers.slice((page - 1) * limit, page * limit);
            return { totalusers, users: paginatedUsers };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_FETCH);
        }
    }

    async findUsersBySearch(search: string) {
        try {
            const searchRegex = new RegExp(search, 'i');
            const query = {
                isDeleted: false,
                ...(search && {
                    $or: [
                        { fname: { $regex: searchRegex } },
                        { lname: { $regex: searchRegex } },
                    ],
                }),
            };
            const users = await this.UsersModel.find(query);
            return users;
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_FETCH);
        }
    }

    async updateUser(id: string, updatedById: string, userUpdateddata: UserUpdateDataDto) {

        try {
            validateObjectId(id, 'User ID');
            validateObjectId(updatedById, 'Updated By ID');
            const updatedData = {
                ...userUpdateddata,
                updatedBy: updatedById,
                updatedAt: new Date()
            }
            const updatedUser = await this.UsersModel.findByIdAndUpdate(id, updatedData, {
                new: true,
            });

            if (!updatedUser) {
                throw new NotFoundException(ResponseMessages.GENERAL.NOT_FOUND);
            }
            return { message: ResponseMessages.USER.UPDATED, updatedUser };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_UPDATE)
        }

    }

    async deleteUser(id: string, deletedById: string) {

        try {
            validateObjectId(id, 'User ID');
            validateObjectId(deletedById, 'deletedById');
            const updatedUser = await this.UsersModel.findByIdAndUpdate(id,
                {
                    isActive: false,
                    isDeleted: true,
                    updatedBy: deletedById,
                    updatedAt: new Date(),
                },
                { new: true }
            );

            if (!updatedUser) {
                throw new NotFoundException(ResponseMessages.GENERAL.NOT_FOUND);
            }
            await this.deleteLeavesByEmployeeId(id);
            await this.leavePolicyServices.deleteUserBalance(id);
            return { message: ResponseMessages.USER.DELETED }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_FETCH)
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

    async loginUser(email: string, userUpdateddata: UserUpdateDataDto) {
        try {
            const existingUser = await this.UsersModel.findOne({ email });
            if (existingUser) {
                const updatedUser = await this.UsersModel.findOneAndUpdate(
                    { email },
                    { $set: userUpdateddata },
                    { new: true }
                );
                return updatedUser;
            } else {
                throw new ConflictException(ResponseMessages.GENERAL.EMAIL_ALREADY_EXISTS);
            }
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }
}