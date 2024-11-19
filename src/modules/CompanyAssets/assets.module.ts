import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AssetsController } from "./assets.controller";
import { AssetsServices } from "./assets.service";
import { Assets, AssetsDataSchema } from "./schemas/assets.schema";
import { AssetsReturnedDataSchema, ReturnedAssets } from "./schemas/returnAssets.schema";
import { OffboardingModule } from "../offboarding/offboarding.module";
import { AssetReturnMailService } from "./services/mail/asset-return-mail.service";
import { UserModule } from "../user/user.module";


@Module({
    imports: [MongooseModule.forFeature([{
        name: Assets.name,
        schema: AssetsDataSchema,
    },
    {
        name: ReturnedAssets.name,
        schema: AssetsReturnedDataSchema
    },
    ]),
        OffboardingModule,
        UserModule
    ],
    providers: [AssetsServices, AssetReturnMailService],
    controllers: [AssetsController],
    exports: [MongooseModule]

})
export class AssetsModule { }