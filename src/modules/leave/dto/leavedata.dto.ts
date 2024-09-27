import { Transform } from "class-transformer";
import { IsDate, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { parseDateString } from "src/helpers/date.helper";
import { LEAVETYPES } from "src/utils/constant";
import { IsBeforeDate } from "src/validators/is-before-date.validator";


type Leavetype = typeof LEAVETYPES[number];

export class LeaveDataDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    employee_id: string;

    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    start_date: Date;

    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    @IsBeforeDate()
    end_date: Date;

    @IsOptional()
    @IsString()
    reason?: string | null;

    @IsNotEmpty()
    @IsIn(LEAVETYPES)
    leave_type: Leavetype

    @IsOptional()
    @IsString()
    status: string = 'Pending'

}   