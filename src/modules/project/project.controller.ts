import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProjectServices } from "./project.services";
import { ProjectDataDto, ProjectUpdateDataDto } from "./dtos/project.dto";


@UseGuards(AuthGuard('jwt'))
@Controller('api/projects')
export class ProjectController {
    constructor(private readonly projectServices: ProjectServices) { }

    @Get('/:page?/:limit?/:search?')
    async getHolidays(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
        return this.projectServices.getAllProjects(page, limit, search)
    }

    @Post('create/:createdby')
    async create(@Param('createdby') createdById: string, @Body() projectData: ProjectDataDto) {
        return this.projectServices.create(createdById, projectData)
    }

    @Patch('update/:updatedby')
    async update(@Param('updatedby') updatedById: string, @Body() projectData: ProjectUpdateDataDto) {
        return this.projectServices.update(updatedById, projectData)
    }

    @Patch('delete/:id')
    async delete(@Param('id') id: string) {
        return this.projectServices.delete(id)
    }

}