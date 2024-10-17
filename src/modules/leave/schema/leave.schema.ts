import { Injectable } from '@nestjs/common';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { LeaveTypes } from 'src/modules/leavePolicies/schemas/leaveTypes.schema';
import { Users } from 'src/modules/user/schemas/user.schema';
import { HALFDAYTIME, LEAVEDAY, STATUSTYPE } from 'src/utils/constant';


type Statustype = typeof STATUSTYPE[number]
type leaveDay = typeof LEAVEDAY[number];
type halfDayTime = typeof HALFDAYTIME[number];
@Injectable()
@Schema()
export class Leaves extends Document {

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    employee_id: string;

    @Prop({ type: Date, required: true })
    start_date: Date

    @Prop({ type: Date, required: true })
    end_date: Date

    @Prop({ type: Number, required: true })
    totaldays: number

    @Prop({ type: String, nullable: true })
    reason: string | null

    @Prop({ type: String, default: 'pending' })
    status: Statustype

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId })
    createdBy: string;

    @Prop({ type: MongooseSchema.Types.ObjectId })
    updatedBy: string;

    @Prop({ type: Types.ObjectId, ref: LeaveTypes.name, required: true })
    leave_type_id: string;

    @Prop({ type: String, required: true, enum: LEAVEDAY })
    start_day: leaveDay

    @Prop({ type: String, required: true, enum: LEAVEDAY })
    end_day: leaveDay

    @Prop({ type: String, enum: HALFDAYTIME })
    start_half_day_time: halfDayTime

    @Prop({ type: String, enum: HALFDAYTIME })
    end_half_day_time: halfDayTime
}

export const LeaveSchema = SchemaFactory.createForClass(Leaves);