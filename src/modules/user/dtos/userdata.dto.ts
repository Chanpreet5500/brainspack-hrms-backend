import { IsEmail, IsIn, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { DEPARTMENT, USERROLES } from "src/utils/constant";
import { ResponseMessages } from "src/utils/responseMessages";


type UserRole = typeof USERROLES[number];
type Department = typeof DEPARTMENT[number];

export class UserDataDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: ResponseMessages.VALIDATION.FIRST_NAME_INVALID,
    })
    fname: string

    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: ResponseMessages.VALIDATION.LAST_NAME_INVALID,
    })
    lname: string


    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsIn(USERROLES)
    role: UserRole

    @IsNotEmpty()
    @IsIn(DEPARTMENT)
    department: Department

}   