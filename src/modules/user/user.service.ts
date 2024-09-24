import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserDataDto } from "./dtos/userdata.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Users } from "./schemas/user.schema";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/constants/responseMessages";

@Injectable()
export class UserServices {
    constructor(
        @InjectModel(Users.name) private UsersModel: Model<Users>,
    ) { }

    async createuser(userData: UserDataDto) {
        const { fname, lname, email, role, department } = userData;
        const createdUser = await this.UsersModel.create({
            fname, lname, email, role, department
        });
        return { message: ResponseMessages.USER.CREATED, userId: createdUser._id }
    }

    async getusers(page: number, limit: number) {
        const totalusers = await this.UsersModel.countDocuments()
        const users = await this.UsersModel.find().skip((page - 1) * limit).limit(limit);
        return { totalusers: totalusers, users: users }
    }

    async updateuser(id: string, userData: UserDataDto) {
        const updatedData = {
            ...userData,
            updatedAt: new Date()
        }
        const updatedUser = await this.UsersModel.findByIdAndUpdate(id, updatedData, {
            new: true,
            useFindAndModify: false,
        });

        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return { message: ResponseMessages.USER.UPDATED, updateduser: updatedUser };
    }

    async deleteuser(id: string) {

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid user ID: ${id}`);
        }
        const deletedUser = await this.UsersModel.findByIdAndDelete(id);

        if (!deletedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return { message: ResponseMessages.USER.DELETED }
    }
}