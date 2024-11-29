import { Injectable } from '@nestjs/common';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from 'src/modules/user/schemas/user.schema';
import { STATUSTYPE } from 'src/utils/constant';


type Statustype = typeof STATUSTYPE[number]
@Injectable()
@Schema()
export class Resignations extends Document {

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    employee_id: string;

    @Prop({ type: String })
    reason: string

    @Prop()
    file: Buffer;

    @Prop({ type: Date, default: Date.now })
    submission_date: Date;

    @Prop({ type: String, default: 'pending' })
    status: Statustype

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

    @Prop({ type: Types.ObjectId, ref: Users.name })
    createdBy: string;

    @Prop({ type: Types.ObjectId, ref: Users.name })
    updatedBy: string;
}

export const ResignationSchema = SchemaFactory.createForClass(Resignations);