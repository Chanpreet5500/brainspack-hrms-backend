import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Projects, ProjectSchema } from "./schema/project.schema";
import { ProjectServices } from "./project.services";
import { ProjectController } from "./project.controller";
import { UserModule } from "../user/user.module";
import { ProjectMailService } from "./services/mail/assignedProject.service";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Projects.name,
            schema: ProjectSchema
        }]),
        UserModule
    ],
    providers: [ProjectServices, ProjectMailService],
    controllers: [ProjectController],
})
export class ProjectModule { }