import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { parseDateString } from "src/helpers/date.helper";
import { OFFBOARDING_STATUS } from "src/utils/constant";

type offboardingStatus = typeof OFFBOARDING_STATUS[number];

export class OffboardingDataDto {


    @IsMongoId()
    employee_id: string

    @IsIn(OFFBOARDING_STATUS)
    status: offboardingStatus

    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    completion_date: Date;

    @IsOptional()
    @IsBoolean()
    isActive: boolean

}
