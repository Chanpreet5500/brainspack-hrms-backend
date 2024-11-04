import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserDataDto, UserUpdateDataDto } from "./dtos/userdata.dto";
import { LoginDto } from "./dtos/login.dto";
import { AuthGuard } from "@nestjs/passport";


@Controller('api/users')
export class UserController {
    constructor(private readonly userServices: UserServices) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:page?/:limit?/:search?')
    async getUsers(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
        return this.userServices.getUsers(page, limit, search)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/create/:createdby')
    async create(@Param('createdby') createdById: string, @Body() userdata: UserDataDto) {
        return this.userServices.createUser(userdata, createdById)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/update/:updatedby/:id')
    async update(@Param('id') id: string,
        @Param('updatedby') updatedById: string,
        @Body() userUpdateddata: UserUpdateDataDto) {
        return this.userServices.updateUser(id, updatedById, userUpdateddata)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('/delete/:deletedby/:id')
    async delete(@Param('id') id: string, @Param('deletedby') deletedById: string) {
        return this.userServices.deleteUser(id, deletedById)
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto) {
        return this.userServices.loginUser(loginDto)
    }
}