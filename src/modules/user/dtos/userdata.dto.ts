import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";
import { DEPARTMENT, USERROLES } from "src/utils/constant";
import { ResponseMessages } from "src/utils/responseMessages";


type UserRole = typeof USERROLES[number];
type Department = typeof DEPARTMENT[number];

export class UserDataDto {

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: ResponseMessages.VALIDATION.FIRST_NAME_INVALID,
    })
    fname: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: ResponseMessages.VALIDATION.LAST_NAME_INVALID,
    })
    lname: string


    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsOptional()
    @IsNotEmpty()
    @IsIn(USERROLES)
    role: UserRole

    @IsOptional()
    @IsNotEmpty()
    @IsIn(DEPARTMENT)
    department: Department

    @IsOptional()
    @IsBoolean()
    isActive: boolean

    @IsOptional()
    @IsBoolean()
    isDeleted: boolean
}   