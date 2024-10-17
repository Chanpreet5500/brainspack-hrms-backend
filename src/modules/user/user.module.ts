import { forwardRef, Module } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UserSchema } from "./schemas/user.schema";
import { LeavePolicyModule } from "../leavePolicies/leavePolicies.module";
import { LeaveModule } from "../leave/leave.module";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Users.name,
            schema: UserSchema
        }]),
        LeavePolicyModule,
        forwardRef(() => LeaveModule)
    ],
    providers: [UserServices],
    controllers: [UserController],
    exports: [MongooseModule, UserServices]
})
export class UserModule { }