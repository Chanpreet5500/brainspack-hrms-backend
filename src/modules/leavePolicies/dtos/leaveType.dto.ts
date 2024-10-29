import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LeaveTypeDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

}

export class UpdateLeaveTypeDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    description: string
}