import { IsEmail, IsIn, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { DEPARTMENT, USERROLES } from "src/utils/constants/constant";


type UserRole = typeof USERROLES[number];
type Department = typeof DEPARTMENT[number];

export class UserDataDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: 'First name should only contain alphabets and spaces',
    })
    fname: string

    @IsNotEmpty()
    @IsString()
    @Length(1, 50)
    @Matches(/^[A-Za-z\s]+$/, {
        message: 'Last name should only contain alphabets and spaces',
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