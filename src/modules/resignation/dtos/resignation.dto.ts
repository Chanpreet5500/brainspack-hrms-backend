import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ResignationDataDto {
    @IsString()
    @IsMongoId()
    employee_id: string;

    @IsNotEmpty()
    file: Buffer

    @IsString()
    reason: string;
}   