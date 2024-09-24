import { Module } from "@nestjs/common";
import { UserServices } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UserSchema } from "./schemas/user.schema";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Users.name,
            schema: UserSchema
        }]),
    ],
    providers: [UserServices],
    controllers: [UserController],
})
export class UserModule { }