import { Transform } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsString, } from "class-validator";
import { parseDateString } from "src/helpers/date.helper";
// import { RETURN_ASSET_STATUS } from "src/utils/constant";

// type returnAssetStatus = typeof RETURN_ASSET_STATUS[number];

export class ReturnAssetsDataDto {
    @IsMongoId()
    asset_id: string;

    @IsMongoId()
    employee_id: string;

    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    return_date: string;

    @IsNotEmpty()
    @IsString()
    condition_report: string

    @IsNotEmpty()
    @IsString()
    serial_number: string;

    @IsNotEmpty()
    @IsString()
    inspection_notes: string;

    @IsNotEmpty()
    @IsNumber()
    deduction_amount: string;

    // @IsOptional()
    // @IsIn(RETURN_ASSET_STATUS)
    // status: returnAssetStatus

}   