import { Body, Controller, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserDataDto, UserUpdateDataDto } from "./dtos/userdata.dto";


@Controller('api/users')
export class UserController {
    constructor(private readonly userServices: UserServices) { }

    @Get('/:page?/:limit?/:search?')
    async getUsers(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
        return this.userServices.getUsers(page, limit, search)
    }

    @Post('/create/:createdby')
    async create(@Param('createdby') createdById: string, @Body() userdata: UserDataDto) {
        return this.userServices.createUser(userdata, createdById)
    }

    @Put('/update/:updatedby/:id')
    async update(@Param('id') id: string,
        @Param('updatedby') updatedById: string,
        @Body() userUpdateddata: UserUpdateDataDto) {
        return this.userServices.updateUser(id, updatedById, userUpdateddata)
    }

    @Patch('/delete/:deletedby/:id')
    async delete(@Param('id') id: string, @Param('deletedby') deletedById: string) {
        return this.userServices.deleteUser(id, deletedById)
    }

    @Patch('/login/:email')
    async login(@Query('email') email: string, @Body() userUpdateddata: UserUpdateDataDto) {
        return this.userServices.loginUser(email, userUpdateddata)
    }
}