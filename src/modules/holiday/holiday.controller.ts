import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { HolidayDataDto, HolidayUpdateDataDto } from "./dtos/holiday.dto";
import { HolidayServices } from "./holiday.service";


@Controller('api/holidays')
export class HolidayController {
    constructor(private readonly holidayServices: HolidayServices) { }

    @Get('/')
    async getHolidays() {
        return this.holidayServices.getAllHolidays()
    }

    @Post('create/:createdby')
    async create(@Param('createdby') createdById: string, @Body() holidayData: HolidayDataDto) {
        return this.holidayServices.createHoliday(createdById, holidayData)
    }

    @Patch('update/:id/:updatedby')
    async update(@Param('id') id: string, @Param('updatedby') updatedById: string, @Body() holidayData: HolidayUpdateDataDto) {
        return this.holidayServices.updateHoliday(id, updatedById, holidayData)
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        return this.holidayServices.deleteHoliday(id)
    }

}