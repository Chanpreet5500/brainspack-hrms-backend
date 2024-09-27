import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Leaves, LeaveSchema } from "./schema/leave.schema";
import { LeaveServices } from "./leave.service";
import { LeaveController } from "./leave.controller";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Leaves.name,
            schema: LeaveSchema
        }]),
    ],
    providers: [LeaveServices],
    controllers: [LeaveController],
})
export class LeaveModule { }