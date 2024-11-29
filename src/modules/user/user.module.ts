import { forwardRef, Module } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UserSchema } from "./schemas/user.schema";
import { LeavePolicyModule } from "../leavePolicies/leavePolicies.module";
import { LeaveModule } from "../leave/leave.module";
import { JwtModule } from "@nestjs/jwt";
import { WelcomeUserMailService } from "./services/mail/userWelcome.service";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Users.name,
            schema: UserSchema
        }]),
        LeavePolicyModule,
        forwardRef(() => LeaveModule),
        forwardRef(() => JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '30d' },
        })),
    ],
    providers: [UserServices, WelcomeUserMailService],
    controllers: [UserController],
    exports: [MongooseModule, UserServices]
})
export class UserModule { }