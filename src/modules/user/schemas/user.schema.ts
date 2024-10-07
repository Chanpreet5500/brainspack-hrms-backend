import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DEPARTMENT, USERROLES } from 'src/utils/constant';

type UserRole = typeof USERROLES[number];
type Department = typeof DEPARTMENT[number];
@Injectable()
@Schema()
export class Users extends Document {

    @Prop({ type: String, required: true, maxlength: 50 })
    fname: string;

    @Prop({ type: String, required: true, maxlength: 50 })
    lname: string

    @Prop({ type: String, required: true, unique: true })
    email: string

    @Prop({ type: String, required: true, enum: USERROLES })
    role: UserRole

    @Prop({ type: String, required: true, enum: DEPARTMENT })
    department: Department

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
    createdBy: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
    updatedBy: string;

}

export const UserSchema = SchemaFactory.createForClass(Users);
UserSchema.index({ fname: 'text', lname: 'text' });
