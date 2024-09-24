import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserDataDto } from "./dtos/userdata.dto";


@Controller('users')
export class UserController {
    constructor(private readonly userServices: UserServices) { }

    @Get('/all/:page/:limit')
    async getUsers(@Param('page') page: number, @Param('limit') limit: number) {
        return this.userServices.getusers(page, limit)
    }

    @Post('/create')
    async create(@Body() userdata: UserDataDto) {
        return this.userServices.createuser(userdata)
    }

    @Put('/update/:id')
    async update(@Param('id') id: string, @Body() userdata: UserDataDto) {
        return this.userServices.updateuser(id, userdata)
    }

    @Delete('/delete/:id')
    async delete(@Param('id') id: string) {
        return this.userServices.deleteuser(id)
    }
}