import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Assets } from "./schemas/assets.schema";
import { ReturnedAssets } from "./schemas/returnAssets.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { AssetsDataDto } from "./dtos/assets.dto";
import { ASSETSTATUS, RETURN_ASSET_STATUS } from "src/utils/constant";
import { ReturnAssetsDataDto } from "./dtos/returnAssets.dto";
import { OffboardingServices } from "../offboarding/offboarding.service";
import { AssetReturnMailService } from "./services/mail/asset-return-mail.service";
import { UserServices } from "../user/user.service";

type assetStatus = typeof ASSETSTATUS[number];
type returnAssetStatus = typeof RETURN_ASSET_STATUS[number];


@Injectable()
export class AssetsServices {
    constructor(
        @InjectModel(Assets.name) private assetsModel: Model<Assets>,
        @InjectModel(ReturnedAssets.name) private returnAssetsModel: Model<ReturnedAssets>,
        private offboardingServices: OffboardingServices,
        private assetReturnMailService: AssetReturnMailService,
        private readonly UserServices: UserServices,
    ) { }

    //Fetch all assets with pagination and optional search
    async getAllAssets(page: number, limit: number, search: string) {
        try {
            const assets = await this.findAssetsBySearch(search);
            const totalAssets = assets.length;
            const paginatedAssets = assets.slice((page - 1) * limit, page * limit);
            return { totalAssets, assets: paginatedAssets };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.ASSET.FAILED_FETCH);
        }
    }

    //Helper function to search for assets
    private async findAssetsBySearch(search: string) {
        try {
            const searchRegex = new RegExp(search, 'i');
            const query = {
                ...(search && {
                    $or: [
                        { type: { $regex: searchRegex } },
                        { serial_number: { $regex: searchRegex } },
                    ],
                }),
            };
            return await this.assetsModel.find(query)
                .populate('assigned_to', 'fname lname email')
                .populate('assigned_by', 'fname lname email')
                .exec();
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.ASSET.FAILED_FETCH);
        }
    }

    // Assign a new asset
    async assignAsset(assetData: AssetsDataDto) {
        try {
            const { serial_number, ...rest } = assetData;
            const existingAsset = await this.assetsModel.findOne({ serial_number });
            if (existingAsset) {
                return {
                    message: ResponseMessages.ASSET.ASSET_ALREADY_EXISTS,
                    assetId: existingAsset._id
                }
            }
            const createdAsset = await this.assetsModel.create({
                serial_number,
                ...rest,
                assigned_to: new Types.ObjectId(assetData.assigned_to),
                assigned_by: new Types.ObjectId(assetData.assigned_by)
            });
            return {
                message: ResponseMessages.ASSET.CREATED,
                assetId: createdAsset._id
            }
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.ASSET.FAILED_CREATE)
        }

    }

    //Update an asset by ID
    async updateAsset(assetId: string, status: assetStatus) {
        try {
            const updatedAsset = await this.assetsModel.findByIdAndUpdate(assetId,
                {
                    status,
                    updatedAt: new Date()
                },
                {
                    new: true,
                });
            if (!updatedAsset) {
                throw new NotFoundException(ResponseMessages.ASSET.NOT_FOUND);
            }
            if (status === 'returned') {
                await this.handleAssetReturn(updatedAsset);
            }
            return { message: ResponseMessages.ASSET.UPDATED };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.ASSET.FAILED_UPDATE)
        }

    }

    //Handle asset return logic
    private async handleAssetReturn(asset: Assets) {
        const employeeId = asset.assigned_to.toString();
        const assetsToReturn = await this.findAssetsByEmployeeId(employeeId);
        if (assetsToReturn.length === 0) {
            await this.offboardingServices.updateOffboardingByEmployeeId(
                asset.assigned_to,
            );
        }
        await this.completeReturnAssetByAssetId(asset._id.toString());
    }

    // Delete an asset by ID
    async delete(id: string) {
        try {
            const deletedAsset = await this.assetsModel.findByIdAndDelete(id);
            if (!deletedAsset) {
                throw new NotFoundException(ResponseMessages.ASSET.NOT_FOUND);
            }
            return { message: ResponseMessages.ASSET.DELETED };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.ASSET.FAILED_DELETE);
        }

    }

    // Find assets by employee ID
    async findAssetsByEmployeeId(employeeId: string) {
        return this.assetsModel.find({
            assigned_to: new Types.ObjectId(employeeId),
            status: { $in: ['assigned', 'in_maintenance'] },
        });
    }

    async getAllReturnAssets(page: number, limit: number, search: string) {
        try {
            const assets = await this.findReturnAssetsBySearch(search);
            const totalReturnAssets = assets.length;
            const paginatedReturnAssets = assets.slice((page - 1) * limit, page * limit);
            return { totalReturnAssets, assets: paginatedReturnAssets };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RETURN_ASSET.FAILED_FETCH);
        }
    }

    async findReturnAssetsBySearch(search: string) {
        try {
            const searchRegex = new RegExp(search, 'i');
            const query = {
                ...(search && {
                    $or: [
                        { status: { $regex: searchRegex } },
                        { serial_number: { $regex: searchRegex } },
                    ],
                }),
            };
            return await this.returnAssetsModel.find(query);
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RETURN_ASSET.FAILED_FETCH);
        }
    }

    async createReturnAssetReq(returnAssetData: ReturnAssetsDataDto) {
        try {
            const { asset_id, employee_id, serial_number, ...rest } = returnAssetData;
            const existingReturnAsset = await this.returnAssetsModel.findOne({ serial_number });
            if (existingReturnAsset) {
                // return { message: ResponseMessages.RETURN_ASSET.ALREADY_EXISTS, assetId: existingReturnAsset._id }
                throw new ConflictException(ResponseMessages.RETURN_ASSET.ALREADY_EXISTS);
            }

            const createdReturnAsset = await this.returnAssetsModel.create({
                asset_id: new Types.ObjectId(asset_id),
                employee_id: new Types.ObjectId(employee_id),
                serial_number,
                ...rest
            });
            const updatedUser = await this.UserServices.getUserDetailById([employee_id])
            const adminMailAddress = await this.UserServices.higherUserEmail();
            await this.assetReturnMailService.sendReqGenerated(updatedUser[0]?.email, adminMailAddress)
            return { message: ResponseMessages.RETURN_ASSET.CREATED, assetId: createdReturnAsset._id }

        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RETURN_ASSET.FAILED_CREATE)
        }

    }

    async updateReturnAsset(requestId: string, status: returnAssetStatus) {

        try {
            const updatedReturnAsset = await this.returnAssetsModel.findByIdAndUpdate(requestId,
                {
                    status,
                    updatedAt: new Date()
                },
                { new: true }
            );
            if (!updatedReturnAsset) {
                throw new NotFoundException(ResponseMessages.RETURN_ASSET.NOT_FOUND);
            }
            const updatedUser = await this.UserServices.getUserDetailById([updatedReturnAsset.employee_id.toString()])
            if (status === 'approved') {
                await this.assetReturnMailService.sendReqApproved(updatedUser[0]?.email)
            } else if (status === 'declined') {
                await this.assetReturnMailService.sendReqDeclined(updatedUser[0]?.email)
            }
            return { message: ResponseMessages.RETURN_ASSET.UPDATED };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RETURN_ASSET.FAILED_UPDATE)
        }

    }

    async deleteReturnAsset(id: string) {

        try {
            const deletedReturnAsset = await this.returnAssetsModel.findByIdAndDelete(id);
            if (!deletedReturnAsset) {
                throw new NotFoundException(ResponseMessages.RETURN_ASSET.NOT_FOUND);
            }
            return { message: ResponseMessages.RETURN_ASSET.DELETED };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RETURN_ASSET.FAILED_DELETE);
        }

    }

    // Complete the return of an asset
    async completeReturnAssetByAssetId(assetId: string) {
        try {
            const updatedAsset = await this.returnAssetsModel.findOneAndUpdate({ asset_id: new Types.ObjectId(assetId) },
                { status: 'completed', updatedAt: new Date() },
                { new: true },
            );
            if (!updatedAsset) {
                throw new NotFoundException(ResponseMessages.RETURN_ASSET.NOT_FOUND);
            }
            return { message: ResponseMessages.RETURN_ASSET.UPDATED };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.RETURN_ASSET.FAILED_UPDATE)
        }

    }
}