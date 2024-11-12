import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Resignations, ResignationSchema } from "./schemas/resignation.schema";
import { ResignationServices } from "./resignation.service";
import { ResignationController } from "./resignation.controller";
import { UserModule } from "../user/user.module";
import { UserResignMailService } from "./services/mail/userresign.service";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Resignations.name,
            schema: ResignationSchema
        }]),
        UserModule
    ],
    providers: [ResignationServices, UserResignMailService],
    controllers: [ResignationController],
})
export class ResignationModule { }