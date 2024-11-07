import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ResponseMessages } from "src/utils/responseMessages";
import { validateObjectId } from "src/validators/id-validator.validator";
import { Projects } from "./schema/project.schema";
import { ProjectDataDto, ProjectUpdateDataDto } from "./dtos/project.dto";
import { Users } from "../user/schemas/user.schema";

@Injectable()
export class ProjectServices {
    constructor(
        @InjectModel(Projects.name) private ProjectModel: Model<Projects>,
        @InjectModel(Users.name) private UserModel: Model<Users>
    ) { }

    async create(createdById: string, ProjectData: ProjectDataDto) {
        try {
            validateObjectId(createdById, 'Created By ID');
            const { name, description, start_date, end_date, assigned_by, assigned_to } = ProjectData;
            const assignedBy = new Types.ObjectId(assigned_by)
            const assignedTo = assigned_to.map((ele) => new Types.ObjectId(ele))

            await this.ProjectModel.create({
                name, description, start_date, end_date, assigned_by: assignedBy, assigned_to: assignedTo, createdBy: createdById, updatedBy: createdById
            });
            return { message: ResponseMessages.PROJECT.CREATED }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.PROJECT.FAILED_CREATE)
        }

    }

    async getAllProjects() {
        try {
            const projects = await this.ProjectModel.find()
                .populate('assigned_by', 'fname lname email')
                .populate({
                    path: 'assigned_to',
                    model: Users.name,
                    select: 'fname lname email'
                })
                .populate('createdBy', 'fname lname email')
                .populate('updatedBy', 'fname lname email')
                .exec();
            return projects
        } catch (error) {
            throw new InternalServerErrorException(ResponseMessages.PROJECT.FAILED_FETCH);
        }
    }

    async update(updatedById: string, projectUpdateddata: ProjectUpdateDataDto) {

        try {
            validateObjectId(updatedById, 'Updated By ID');
            const updatedData = {
                ...projectUpdateddata,
                updatedBy: updatedById,
                updatedAt: new Date()
            }
            const updatedProject = await this.ProjectModel.findByIdAndUpdate(projectUpdateddata.project_id, updatedData, {
                new: true,
            });

            if (!updatedProject) {
                throw new NotFoundException(ResponseMessages.PROJECT.NOT_FOUND);
            }
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
            validateObjectId(id, 'Project ID');
            const deletedProject = await this.ProjectModel.findByIdAndDelete(id);

            if (!deletedProject) {
                throw new NotFoundException(ResponseMessages.PROJECT.NOT_FOUND);
            }

            return { message: ResponseMessages.PROJECT.DELETED };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(ResponseMessages.PROJECT.FAILED_DELETE);
        }

    }
}