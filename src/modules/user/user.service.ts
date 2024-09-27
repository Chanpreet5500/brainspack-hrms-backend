import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UserDataDto } from "./dtos/userdata.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Users } from "./schemas/user.schema";
import { Model } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { validateObjectId } from "src/validators/id-validator.validator";

@Injectable()
export class UserServices {
    constructor(
        @InjectModel(Users.name) private UsersModel: Model<Users>,
    ) { }

    async createuser(userData: UserDataDto, createdById: string) {
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
            return { message: ResponseMessages.USER.CREATED, userId: createdUser._id }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_CREATE)
        }

    }

    async getusers(page: number, limit: number) {
        try {
            const totalusers = await this.UsersModel.countDocuments();
            const users = await this.UsersModel.find().skip((page - 1) * limit).limit(limit);
            return { totalusers, users }
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_FETCH)
        }

    }

    async updateuser(id: string, updatedById: string, userData: UserDataDto) {

        try {
            validateObjectId(id, 'User ID');
            validateObjectId(updatedById, 'Updated By ID');
            const updatedData = {
                ...userData,
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

    async deleteuser(id: string, deletedById: string) {

        try {
            validateObjectId(id, 'User ID');
            validateObjectId(deletedById, 'deletedById');
            const updatedUser = await this.UsersModel.findByIdAndUpdate(id,
                {
                    isActive: false,
                    updatedBy: deletedById,
                    updatedAt: new Date(),
                },
                { new: true }
            );

            if (!updatedUser) {
                throw new NotFoundException(ResponseMessages.GENERAL.NOT_FOUND);
            }

            return { message: ResponseMessages.USER.DELETED }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_FETCH)
        }

    }
}