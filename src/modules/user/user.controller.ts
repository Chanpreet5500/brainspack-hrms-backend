import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserDataDto } from "./dtos/userdata.dto";


@Controller('api/users')
export class UserController {
    constructor(private readonly userServices: UserServices) { }

    @Get('/:page/:limit')
    async getUsers(@Param('page') page: number, @Param('limit') limit: number) {
        return this.userServices.getusers(page, limit)
    }

    @Post('/create/:createdby')
    async create(@Param('createdby') createdById: string, @Body() userdata: UserDataDto) {
        return this.userServices.createuser(userdata, createdById)
    }

    @Put('/update/:updatedby/:id')
    async update(@Param('id') id: string, @Param('updatedby') updatedById: string, @Body() userdata: UserDataDto) {
        return this.userServices.updateuser(id, updatedById, userdata)
    }

    @Delete('/delete/:deletedby/:id')
    async delete(@Param('id') id: string, @Param('deletedby') deletedById: string) {
        return this.userServices.deleteuser(id, deletedById)
    }
}