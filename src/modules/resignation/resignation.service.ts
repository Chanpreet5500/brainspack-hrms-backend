import { Injectable, InternalServerErrorException, NotFoundException, } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { STATUSTYPE } from "src/utils/constant";
import { Resignations } from "./schemas/resignation.schema";
import { ResignationDataDto } from "./dtos/resignation.dto";
import { ResponseMessages } from "src/utils/responseMessages";
import { UserServices } from "../user/user.service";
import { UserResignMailService } from "./services/mail/userresign.service";

type statusType = typeof STATUSTYPE[number];
@Injectable()
export class ResignationServices {
    constructor(
        @InjectModel(Resignations.name) private ResignationModel: Model<Resignations>,
        private readonly userService: UserServices,
        private resignMailService: UserResignMailService
    ) { }


    async createResignation(createdById: string, data: ResignationDataDto) {
        try {
            const resignationData = {
                employee_id: new Types.ObjectId(data?.employee_id),
                reason: data.reason,
                createdBy: new Types.ObjectId(createdById),
                updatedBy: new Types.ObjectId(createdById),
                file: data.file,
            }
            const result = await this.ResignationModel.create(resignationData)
            const appliesUser = await this.userService.getUserDetailById([data?.employee_id])
            const adminEmails = await this.userService.higherUserEmail();
            adminEmails.map(async (ele) => {
                await this.resignMailService.sendResignToAdmin(ele, appliesUser[0].email)
            })
            await this.resignMailService.sendResignSubmit(appliesUser[0].email)
            return { resignationData_id: result._id, message: ResponseMessages.RESIGNATION.CREATED }
        } catch (err) {
            throw new InternalServerErrorException(ResponseMessages.RESIGNATION.FAILED_CREATE)
        }

    }

    async getAllUploads() {
        try {
            const result = this.ResignationModel.find().populate('employee_id', 'fname lname email').populate('createdBy', 'fname lname email')
                .populate('updatedBy', 'fname lname email').exec();
            return result
        } catch (err) {
            throw new InternalServerErrorException(ResponseMessages.RESIGNATION.FAILED_FETCH)
        }
    }

    async updateresign(updatedById: string, resignId: string, status: statusType) {

        try {

            const updatedData = {
                status,
                updatedBy: new Types.ObjectId(updatedById),
                updatedAt: new Date()
            }
            const updatedResign = await this.ResignationModel.findByIdAndUpdate(resignId, updatedData, {
                new: true,
            });
            if (!updatedResign) {
                throw new NotFoundException(ResponseMessages.GENERAL.NOT_FOUND);
            }
            return { message: ResponseMessages.RESIGNATION.UPDATED };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RESIGNATION.FAILED_UPDATE)
        }

    }

    async delete(id: string) {

        try {
            const deletedResign = await this.ResignationModel.findByIdAndDelete(id);

            if (!deletedResign) {
                throw new NotFoundException(ResponseMessages.RESIGNATION.NOT_FOUND);
            }

            return { message: ResponseMessages.RESIGNATION.DELETED };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RESIGNATION.FAILED_DELETE);
        }

    }
}
