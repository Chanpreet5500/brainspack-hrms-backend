import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { parseDateString } from "src/helpers/date.helper";
import { IsBeforeDate } from "src/validators/is-before-date.validator";



export class ProjectDataDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    start_date: Date;

    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    @IsBeforeDate()
    end_date: Date;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    assigned_by: string;

    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    assigned_to: string[];

}

export class ProjectUpdateDataDto {

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    project_id: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    start_date: Date;

    @IsOptional()
    @IsBoolean()
    isActive: boolean

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => parseDateString(value), { toClassOnly: true })
    @IsDate()
    @IsBeforeDate()
    end_date: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @IsMongoId({ each: true })
    assigned_to: string[];

}