import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Resignations, ResignationSchema } from "./schemas/resignation.schema";
import { ResignationServices } from "./resignation.service";
import { ResignationController } from "./resignation.controller";
import { UserModule } from "../user/user.module";
import { UserResignMailService } from "./services/mail/userresign.service";
import { OffboardingModule } from "../offboarding/offboarding.module";
import { OffboardingServices } from "../offboarding/offboarding.service";
import { AssetsModule } from "../CompanyAssets/assets.module";
import { AssetsServices } from "../CompanyAssets/assets.service";
import { AssetReturnMailService } from "../CompanyAssets/services/mail/asset-return-mail.service";


@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Resignations.name,
            schema: ResignationSchema
        }]),
        UserModule,
        OffboardingModule,
        AssetsModule
    ],
    providers: [ResignationServices, UserResignMailService, OffboardingServices, AssetsServices, AssetReturnMailService],
    controllers: [ResignationController],
})
export class ResignationModule { }