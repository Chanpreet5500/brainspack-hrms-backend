import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";

import { Offboarding } from "./schemas/offboarding.schema";
import { OffboardingMailService } from "./services/mail/offboarding.service";
import { UserServices } from "../user/user.service";

@Injectable()
export class OffboardingServices {
    constructor(
        @InjectModel(Offboarding.name) private offboardingModel: Model<Offboarding>,
        private offboardingMailService: OffboardingMailService,
        private userService: UserServices
    ) { }

    async createOffboardingRequest(employee_id: string, date: Date) {
        try {
            const offboardingStatus = {
                employee_id: new Types.ObjectId(employee_id),
                status: "in_progress",
                completion_date: date
            }
            const createdOffboarding = await this.offboardingModel.create(offboardingStatus);
            return createdOffboarding._id;
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_CREATE)
        }

    }

    async getAllOffboarding(page: number, limit: number, search: string) {
        try {
            const requests = await this.findRequestBySearch(search);
            const totalrequests = requests.length;


            const paginatedrequests = requests.slice((page - 1) * limit, page * limit);
            return { totalrequests, requests: paginatedrequests };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_FETCH);
        }
    }

    async findRequestBySearch(search: string) {
        try {
            const searchRegex = new RegExp(search, 'i');
            const query = {
                isDeleted: false,
                ...(search && {
                    $or: [
                        { employee_id: { $regex: searchRegex } },
                    ],
                }),
            };
            const users = await this.offboardingModel.find(query);
            return users;
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.USER.FAILED_FETCH);
        }
    }

    async updateOffboarding(offboarding_id: string) {
        try {
            const updatedData = {
                status: 'completed',

                updatedAt: new Date()
            }
            const updateOffboarding = await this.offboardingModel.findByIdAndUpdate(offboarding_id, updatedData, {
                new: true,
            });
            if (!updateOffboarding) {
                throw new NotFoundException(ResponseMessages.GENERAL.NOT_FOUND);
            }

        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_UPDATE)
        }

    }

    async updateOffboardingByEmployeeId(id: any) {
        try {
            const updatedData = {
                status: 'completed',

                updatedAt: new Date()
            }
            const updateOffboarding = await this.offboardingModel.findOneAndUpdate({ employee_id: id }, updatedData, {
                new: true,
            });
            if (!updateOffboarding) {
                throw new NotFoundException(ResponseMessages.GENERAL.NOT_FOUND);
            }
            const appliesUser = await this.userService.getUserDetailById([updateOffboarding?.employee_id])
            const adminMailAddress = await this.userService.higherUserEmail();
            await this.offboardingMailService.sendSuccessOffboarding(appliesUser[0].email, adminMailAddress)

        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.LEAVE.FAILED_UPDATE)
        }

    }

}
