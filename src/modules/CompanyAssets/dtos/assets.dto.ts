import { Transform } from "class-transformer";
import { IsDate, IsIn, IsMongoId, IsNotEmpty, IsString, } from "class-validator";
import { parseDateString } from "src/helpers/date.helper";
import { ASSETSTATUS } from "src/utils/constant";

type assetStatus = typeof ASSETSTATUS[number];

export class AssetsDataDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    serial_number: string;

    @IsNotEmpty()
    @IsIn(ASSETSTATUS)
    status: assetStatus

    @IsMongoId()
    assigned_to: string;

    @IsMongoId()
    assigned_by: string;

    @IsNotEmpty()
    @IsString()
    condition: string;

    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    purchase_date: string;

    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    return_due_date: string;

}   