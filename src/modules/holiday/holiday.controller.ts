import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { HolidayDataDto, HolidayUpdateDataDto } from "./dtos/holiday.dto";
import { HolidayServices } from "./holiday.service";
import { AuthGuard } from "@nestjs/passport";


@Controller('api/holidays')
export class HolidayController {
    constructor(private readonly holidayServices: HolidayServices) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async getHolidays() {
        return this.holidayServices.getAllHolidays()
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create/:createdby')
    async create(@Param('createdby') createdById: string, @Body() holidayData: HolidayDataDto) {
        return this.holidayServices.createHoliday(createdById, holidayData)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update/:updatedby')
    async update(@Param('updatedby') updatedById: string, @Body() holidayData: HolidayUpdateDataDto) {
        return this.holidayServices.updateHoliday(updatedById, holidayData)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        return this.holidayServices.deleteHoliday(id)
    }

}