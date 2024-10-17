import { Transform } from "class-transformer";
import { IsDate, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { parseDateString } from "src/helpers/date.helper";
import { HOLIDAYTYPE } from "src/utils/constant";


type holidayType = typeof HOLIDAYTYPE[number];


export class HolidayDataDto {

    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsIn(HOLIDAYTYPE)
    type: holidayType

}

export class HolidayUpdateDataDto {

    @IsOptional()
    @IsString()
    title: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    date: Date;

    @IsOptional()
    @IsIn(HOLIDAYTYPE)
    type: holidayType

}