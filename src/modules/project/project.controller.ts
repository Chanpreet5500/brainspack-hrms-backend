import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProjectServices } from "./project.services";
import { ProjectDataDto, ProjectUpdateDataDto } from "./dtos/project.dto";


@Controller('api/projects')
export class ProjectController {
    constructor(private readonly projectServices: ProjectServices) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async getHolidays() {
        return this.projectServices.getAllProjects()
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create/:createdby')
    async create(@Param('createdby') createdById: string, @Body() projectData: ProjectDataDto) {
        return this.projectServices.create(createdById, projectData)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update/:updatedby')
    async update(@Param('updatedby') updatedById: string, @Body() projectData: ProjectUpdateDataDto) {
        return this.projectServices.update(updatedById, projectData)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        return this.projectServices.delete(id)
    }

}