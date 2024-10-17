import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LeavePolicyDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    leave_type_id: string;

    @IsNotEmpty()
    @IsNumber()
    max_leaves_per_year: number;

    @IsNotEmpty()
    @IsNumber()
    max_leaves: number;
}


export class LeavePolicyUpdateDto {
    @IsOptional()
    @IsString()
    @IsMongoId()
    leave_type_id?: string;

    @IsOptional()
    @IsNumber()
    max_leaves_per_year?: number;

    @IsOptional()
    @IsNumber()
    max_leaves?: number;
}
