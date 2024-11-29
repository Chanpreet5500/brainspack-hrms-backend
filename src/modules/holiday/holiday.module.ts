import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Holidays, HolidaySchema } from "./schemas/holiday.schema";
import { HolidayServices } from "./holiday.service";
import { HolidayController } from "./holiday.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Holidays.name,
            schema: HolidaySchema
        }]),
    ],
    providers: [HolidayServices],
    controllers: [HolidayController],
})
export class HolidayModule { }