import { IsNotEmpty, IsString } from "class-validator";

export class LeaveTypeDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

}