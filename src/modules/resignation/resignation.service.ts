import { Injectable, InternalServerErrorException, NotFoundException, } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { STATUSTYPE } from "src/utils/constant";
import { Resignations } from "./schemas/resignation.schema";
import { ResignationDataDto } from "./dtos/resignation.dto";
import { ResponseMessages } from "src/utils/responseMessages";
import { UserServices } from "../user/user.service";
import { UserResignMailService } from "./services/mail/userresign.service";
import { OffboardingServices } from "../offboarding/offboarding.service";
import { AssetsServices } from "../CompanyAssets/assets.service";

type statusType = typeof STATUSTYPE[number];
@Injectable()
export class ResignationServices {
    constructor(
        @InjectModel(Resignations.name) private ResignationModel: Model<Resignations>,
        private readonly userService: UserServices,
        private resignMailService: UserResignMailService,
        private offboardingServices: OffboardingServices,
        private AssetServices: AssetsServices
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
            await this.resignMailService.sendResignToAdmin(appliesUser[0].email, adminEmails)
            await this.resignMailService.sendResignSubmit(appliesUser[0].email)
            return { resignationData_id: result._id, message: ResponseMessages.RESIGNATION.CREATED }
        } catch (err) {
            throw new InternalServerErrorException(ResponseMessages.RESIGNATION.FAILED_CREATE)
        }

    }

    async getAllUploads(page: number, limit: number, search: string) {
        try {
            const resigns = await this.findResignBySearch(search)
            const totalResigns = resigns.length;
            const paginatedResigns = resigns.slice((page - 1) * limit, page * limit);
            return { totalResigns, resigns: paginatedResigns };
        } catch (err) {
            throw new InternalServerErrorException(ResponseMessages.RESIGNATION.FAILED_FETCH)
        }
    }

    async findResignBySearch(search: string) {
        try {
            const searchRegex = new RegExp(search, 'i');
            const query = {
                ...(search && {
                    $or: [
                        { employee_id: { $regex: searchRegex } },
                    ],
                }),
            };
            const resigns = await this.ResignationModel.find(query).populate('employee_id', 'fname lname email').populate('createdBy', 'fname lname email')
                .populate('updatedBy', 'fname lname email').exec();
            return resigns;
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RESIGNATION.FAILED_FETCH);
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
            const appliesUser = await this.userService.getUserDetailById([updatedResign?.employee_id.toString()])
            if (status === 'approved' && updatedResign) {
                const employeeId = updatedResign.employee_id.toString()
                const offboardingRequestId = await this.offboardingServices.createOffboardingRequest(employeeId, new Date())
                const checkAsset = await this.AssetServices.findAssetsByEmployeeId(employeeId);
                if (checkAsset.length == 0) {
                    await this.offboardingServices.updateOffboarding(offboardingRequestId.toString())
                }
                await this.resignMailService.sendResignApproved(appliesUser[0].email)
            } else if (status === 'rejected') {
                await this.resignMailService.sendResignDeclined(appliesUser[0].email)
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
