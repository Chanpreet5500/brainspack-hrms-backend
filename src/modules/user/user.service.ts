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
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dtos/login.dto";
import { WelcomeUserMailService } from "./services/mail/userWelcome.service";
// import { LeaveServices } from "../leave/leave.service";

@Injectable()
export class UserServices {
    constructor(
        @InjectModel(Users.name) private UsersModel: Model<Users>,
        @InjectModel(Leaves.name) private LeaveModel: Model<Leaves>,
        private readonly leavePolicyServices: LeavePolicyServices,
        private readonly jwtService: JwtService,
        private userMailService: WelcomeUserMailService,
    ) { }

    async createUser(userData: UserDataDto, createdById: string) {
        try {
            validateObjectId(createdById, 'Created By ID');
            const { fname, lname, email, role, department, phoneNumber } = userData;
            const existingUser = await this.UsersModel.findOne({ email });
            if (existingUser) {
                if (existingUser.isDeleted === false) {
                    throw new ConflictException(ResponseMessages.GENERAL.EMAIL_ALREADY_EXISTS);
                } else {
                    const updatedData = {
                        ...userData,
                        isActive: true,
                        isDeleted: false,
                        updatedBy: createdById
                    }
                    await this.UsersModel.findByIdAndUpdate(existingUser._id, updatedData, {
                        new: true,
                    });
                    return { message: ResponseMessages.USER.UPDATED, userId: existingUser._id }
                }
            } else {
                const createdUser = await this.UsersModel.create({
                    fname, lname, email, role, department, createdBy: createdById, updatedBy: createdById, phoneNumber
                });
                const mailAddress = await this.adminWithSuperAdminEmail();
                await this.userMailService.sendSucessSignEmail(email, mailAddress)
                await this.leavePolicyServices.createUserBalance(createdUser._id as string)
                return { message: ResponseMessages.USER.CREATED, userId: createdUser._id }
            }
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

    async loginUser(loginDto: LoginDto) {
        const { email, image } = loginDto;

        try {
            const existingUser = await this.UsersModel.findOne({ email });
            if (existingUser || existingUser.isDeleted === false) {
                if (!existingUser.img && image) {
                    await this.UsersModel.findOneAndUpdate(
                        { email },
                        { img: image },
                        { new: true }
                    );
                }
                const payload = {
                    userId: existingUser._id,
                    email: existingUser.email,
                    fname: existingUser.fname,
                    lname: existingUser.lname,
                    role: existingUser.role,
                    department: existingUser.department,
                    isActive: existingUser.isActive,
                    img: existingUser.img || image
                };
                const accessToken = this.jwtService.sign(payload);
                return { accessToken }
            } else {
                throw new ConflictException(ResponseMessages.GENERAL.EMAIL_NOT_FOUND);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException("Failed to Login")
        }
    }

    async getUserDetailById(userIds: string[]) {
        try {
            const users = await this.UsersModel.find(
                { _id: { $in: userIds } },
                { fname: 1, lname: 1, email: 1 }
            ).exec();

            return users.map(user => ({
                fname: user.fname,
                lname: user.lname,
                email: user.email,
            }));
        } catch (error) {
            console.error('Error fetching user details:', error);
            // throw new Error('Could not fetch user details');
        }
    }

    async higherUserEmail() {
        const roles = ['admin', 'hr'];
        const users = await this.UsersModel.find({ role: { $in: roles }, isActive: true }, { email: 1, _id: 0 }).exec();
        return users.map(user => user.email);
    }
    async adminWithSuperAdminEmail() {
        const roles = ['admin', 'superadmin', 'hr'];
        const users = await this.UsersModel.find({ role: { $in: roles }, isActive: true }, { email: 1, _id: 0 }).exec();
        return users.map(user => user.email);
    }
}