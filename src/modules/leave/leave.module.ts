import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Leaves, LeaveSchema } from "./schema/leave.schema";
import { LeaveServices } from "./leave.service";
import { LeaveController } from "./leave.controller";
import { LeavePolicyModule } from "../leavePolicies/leavePolicies.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Leaves.name,
            schema: LeaveSchema
        }]),
        forwardRef(() => UserModule),
        LeavePolicyModule
    ],
    providers: [LeaveServices],
    controllers: [LeaveController],
    exports: [LeaveServices, MongooseModule]
})
export class LeaveModule { }