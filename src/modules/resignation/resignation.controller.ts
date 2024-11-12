import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResignationDataDto } from "./dtos/resignation.dto";
import { ResignationServices } from "./resignation.service";
import { validateObjectId } from "src/validators/id-validator.validator";
import { ResponseMessages } from "src/utils/responseMessages";


@Controller('api/resignation')
export class ResignationController {
    constructor(private readonly resignationServices: ResignationServices) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('/:createdby')
    async create(@Param('createdby') createdById: string, @Body() resignationData: ResignationDataDto) {
        validateObjectId(createdById, 'Updated By ID')
        return this.resignationServices.createResignation(createdById, resignationData);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllUploads() {
        return await this.resignationServices.getAllUploads();
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update/:updatedby/:resignId/:status?')
    async update(@Param('updatedby') updatedById: string,
        @Param('resignId') resignId: string,
        @Query('status') status: string) {
        if (status !== 'approved' && status !== 'rejected') {
            throw new BadRequestException(ResponseMessages.LEAVE.INVALID_STATUS);
        }
        validateObjectId(resignId, 'Leave ID')
        validateObjectId(updatedById, 'Updated By ID')
        return this.resignationServices.updateresign(updatedById, resignId, status)
    }


    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        validateObjectId(id, 'Resignation ID');
        return this.resignationServices.delete(id)
    }
}