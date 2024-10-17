import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { validateObjectId } from "src/validators/id-validator.validator";
import { Holidays } from "./schemas/holiday.schema";
import { HolidayDataDto, HolidayUpdateDataDto } from "./dtos/holiday.dto";

@Injectable()
export class HolidayServices {
    constructor(
        @InjectModel(Holidays.name) private HolidayModel: Model<Holidays>
    ) { }

    async createHoliday(createdById: string, HolidayData: HolidayDataDto) {
        try {
            validateObjectId(createdById, 'Created By ID');
            const { title, description, date, type } = HolidayData;
            await this.HolidayModel.create({
                title, description, date, type, createdBy: createdById, updatedBy: createdById
            });
            return { message: ResponseMessages.HOLIDAY.CREATED }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.HOLIDAY.FAILED_CREATE)
        }

    }

    async getAllHolidays() {
        try {
            const holidays = await this.HolidayModel.find();
            return holidays
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.HOLIDAY.FAILED_FETCH);
        }
    }

    async updateHoliday(id: string, updatedById: string, holidayUpdateddata: HolidayUpdateDataDto) {

        try {
            validateObjectId(id, 'Holiday ID');
            validateObjectId(updatedById, 'Updated By ID');
            const updatedData = {
                ...holidayUpdateddata,
                updatedBy: updatedById,
                updatedAt: new Date()
            }
            const updatedHoliday = await this.HolidayModel.findByIdAndUpdate(id, updatedData, {
                new: true,
            });

            if (!updatedHoliday) {
                throw new NotFoundException(ResponseMessages.HOLIDAY.NOT_FOUND);
            }
            return { message: ResponseMessages.HOLIDAY.UPDATED, updatedHoliday };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.HOLIDAY.FAILED_UPDATE)
        }

    }

    async deleteHoliday(id: string) {

        try {
            validateObjectId(id, 'Holiday ID');
            const deletedHoliday = await this.HolidayModel.findByIdAndDelete(id);

            if (!deletedHoliday) {
                throw new NotFoundException(ResponseMessages.HOLIDAY.NOT_FOUND);
            }

            return { message: ResponseMessages.HOLIDAY.DELETED };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.HOLIDAY.FAILED_DELETE);
        }

    }
}