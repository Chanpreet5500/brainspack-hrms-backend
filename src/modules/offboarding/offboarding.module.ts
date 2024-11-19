import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Offboarding, OffboardingSchema } from "./schemas/offboarding.schema";
import { OffboardingController } from "./offboarding.controller";
import { OffboardingServices } from "./offboarding.service";
import { OffboardingMailService } from "./services/mail/offboarding.service";
import { UserModule } from "../user/user.module";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Offboarding.name,
            schema: OffboardingSchema
        }]),
        UserModule
    ],
    providers: [OffboardingServices, OffboardingMailService],
    controllers: [OffboardingController],
    exports: [OffboardingServices, MongooseModule, OffboardingMailService]
})
export class OffboardingModule { }