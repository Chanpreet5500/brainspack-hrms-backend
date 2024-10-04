import { Injectable } from '@nestjs/common';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Users } from 'src/modules/user/schemas/user.schema';
import { LEAVETYPES, STATUSTYPE } from 'src/utils/constant';


type Leavetype = typeof LEAVETYPES[number];
type Statustype = typeof STATUSTYPE[number]
@Injectable()
@Schema()
export class Leaves extends Document {

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    employee_id: string;

    @Prop({ type: String, required: true, enum: LEAVETYPES })
    leave_type: Leavetype

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
}

export const LeaveSchema = SchemaFactory.createForClass(Leaves);