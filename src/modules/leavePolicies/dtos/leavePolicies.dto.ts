import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LeavePolicyDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    leave_type_id: string;

    @IsNotEmpty()
    @IsNumber()
    max_leaves_per_year: number;
}

export class LeavePolicyUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    max_leaves_per_year?: number;
}
