import { Transform } from "class-transformer";
import { IsDate, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { parseDateString } from "src/helpers/date.helper";
import { HALFDAYTIME, LEAVEDAY } from "src/utils/constant";
import { IsBeforeDate } from "src/validators/is-before-date.validator";

type leaveDay = typeof LEAVEDAY[number];
type halfDayTime = typeof HALFDAYTIME[number];

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
    @IsString()
    @IsMongoId()
    leave_type_id: string;

    @IsNotEmpty()
    @IsIn(LEAVEDAY)
    start_day: leaveDay

    @IsNotEmpty()
    @IsIn(LEAVEDAY)
    end_day: leaveDay

    @ValidateIf((o) => o.start_day === 'half')
    @IsNotEmpty()
    @IsIn(HALFDAYTIME)
    start_half_day_time?: halfDayTime;

    @ValidateIf((o) => o.end_day === 'half')
    @IsNotEmpty()
    @IsIn(HALFDAYTIME)
    end_half_day_time?: halfDayTime;
}   