import { forwardRef, Module } from "@nestjs/common";
import { LeavePolicyServices } from "./leavePolicies.service";
import { LeavePolicyController } from "./leavePolicies.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { LeaveTypes, LeaveTypeSchema } from "./schemas/leaveTypes.schema";
import { LeavePolicies, LeavePolicySchema } from "./schemas/leavePolicies.schema";
import { LeaveBalance, LeaveBalanceSchema } from "./schemas/leaveBalance.schema";
import { UserModule } from "../user/user.module";


@Module({
    imports: [MongooseModule.forFeature([{
        name: LeaveTypes.name,
        schema: LeaveTypeSchema,
    },
    {
        name: LeavePolicies.name,
        schema: LeavePolicySchema
    },
    {
        name: LeaveBalance.name,
        schema: LeaveBalanceSchema
    }
    ]),
    forwardRef(() => UserModule)
    ],
    providers: [LeavePolicyServices],
    controllers: [LeavePolicyController],
    exports: [LeavePolicyServices, MongooseModule]

})
export class LeavePolicyModule { }