import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { validateObjectId } from "src/validators/id-validator.validator";
import { Projects } from "./schema/project.schema";
import { ProjectDataDto, ProjectUpdateDataDto } from "./dtos/project.dto";
import { Users } from "../user/schemas/user.schema";
import { ProjectMailService } from "./services/mail/assignedProject.service";
import { UserServices } from "../user/user.service";

@Injectable()
export class ProjectServices {
    constructor(
        @InjectModel(Projects.name) private ProjectModel: Model<Projects>,
        private readonly UserServices: UserServices,
        private projectMailService: ProjectMailService
    ) { }

    async create(createdById: string, ProjectData: ProjectDataDto) {
        try {
            validateObjectId(createdById, 'Created By ID');
            const { name, description, start_date, end_date, assigned_by, assigned_to } = ProjectData;
            const assignedBy = new Types.ObjectId(assigned_by)
            const assignedTo = assigned_to.map((ele) => new Types.ObjectId(ele))

            await this.ProjectModel.create({
                name, description, start_date, end_date, assigned_by: assignedBy, assigned_to: assignedTo, createdBy: new Types.ObjectId(createdById), updatedBy: new Types.ObjectId(createdById)
            });
            const assignedUserDetails = await this.UserServices.getUserDetailById(assigned_to);
            const assignedUserEmails = assignedUserDetails.map((ele) => ele.email)
            const assignedByDetails = await this.UserServices.getUserDetailById([assigned_by]);
            const assignedByEmail = assignedByDetails[0].email;
            await this.projectMailService.sendAssignedToEmail(assignedUserEmails, assignedByEmail, name)
            await this.projectMailService.sendAssignedByEmail(assignedByEmail, name, assignedUserEmails);
            return { message: ResponseMessages.PROJECT.CREATED }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.PROJECT.FAILED_CREATE)
        }

    }

    async getAllProjects(page: number, limit: number, search: string) {
        try {
            const projects = await this.findProjectsBySearch(search)
            const totalProjects = projects.length;
            const paginatedProjects = projects.slice((page - 1) * limit, page * limit);
            return { totalProjects, projects: paginatedProjects };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.PROJECT.FAILED_FETCH);
        }
    }

    async findProjectsBySearch(search: string) {
        try {
            const searchRegex = new RegExp(search, 'i');
            const query = {
                ...(search && {
                    $or: [
                        { name: { $regex: searchRegex } },
                    ],
                }),
            };
            const projects = await this.ProjectModel.find(query).populate('assigned_by', 'fname lname email')
                .populate({
                    path: 'assigned_to',
                    model: Users.name,
                    select: 'fname lname email'
                })
                .populate('createdBy', 'fname lname email')
                .populate('updatedBy', 'fname lname email')
                .exec();;
            return projects;
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.PROJECT.FAILED_FETCH);
        }
    }

    async update(updatedById: string, projectUpdateddata: ProjectUpdateDataDto) {

        try {
            validateObjectId(updatedById, 'Updated By ID');
            const updatedData = {
                ...projectUpdateddata,
                updatedBy: new Types.ObjectId(updatedById),
                updatedAt: new Date()
            }
            const updatedProject = await this.ProjectModel.findByIdAndUpdate(projectUpdateddata.project_id, updatedData, {
                new: true,
            });

            if (!updatedProject) {
                throw new NotFoundException(ResponseMessages.PROJECT.NOT_FOUND);
            }
            const assignedUserIds = await updatedProject.assigned_to.map((ele) => ele.toString())
            const assignedUserDetails = await this.UserServices.getUserDetailById(assignedUserIds);
            const assignedUserEmails = assignedUserDetails.map((ele) => ele.email)
            const updatedByDetails = await this.UserServices.getUserDetailById([updatedProject.updatedBy.toString()]);
            const updatedByEmail = updatedByDetails[0].email;
            const assignedByDetails = await this.UserServices.getUserDetailById([updatedProject.assigned_by.toString()]);
            const assignedByEmail = assignedByDetails[0].email;

            await this.projectMailService.sendUpdateEmail(assignedUserEmails, updatedByEmail, updatedProject.name)
            await this.projectMailService.sendUpdatetoAssignedBy(assignedByEmail, updatedByEmail, updatedProject.name);
            return { message: ResponseMessages.PROJECT.UPDATED, updatedProject };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.PROJECT.FAILED_UPDATE)
        }

    }

    async delete(id: string) {

        try {
            const updatedData = {
                isActive: false,
                updatedAt: new Date()
            }
            const updatedProject = await this.ProjectModel.findByIdAndUpdate(id, updatedData, {
                new: true,
            });

            if (!updatedProject) {
                throw new NotFoundException(ResponseMessages.PROJECT.NOT_FOUND);
            }
            return { message: ResponseMessages.PROJECT.DELETED };
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.PROJECT.FAILED_DELETE)
        }
    }
}