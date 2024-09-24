import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DEPARTMENT, USERROLES } from 'src/utils/constants/constant';

type UserRole = typeof USERROLES[number];
type Department = typeof DEPARTMENT[number];
@Injectable()
@Schema()
export class Users extends Document {

    @Prop({ type: String, required: true })
    fname: string;

    @Prop({ type: String, required: true })
    lname: string

    @Prop({ type: String, required: true, unique: true })
    email: string

    @Prop({ type: String, required: true, enum: USERROLES })
    role: UserRole

    @Prop({ type: String, required: true, enum: DEPARTMENT })
    department: Department

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(Users);