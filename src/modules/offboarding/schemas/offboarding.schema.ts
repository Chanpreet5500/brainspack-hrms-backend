import { Injectable } from '@nestjs/common';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from 'src/modules/user/schemas/user.schema';
import { OFFBOARDING_STATUS } from 'src/utils/constant';

type offboardingStatus = typeof OFFBOARDING_STATUS[number];

@Injectable()
@Schema({ timestamps: true })
export class Offboarding extends Document {

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    employee_id: string;

    @Prop({ type: Date, required: true })
    completion_date: Date

    @Prop({ type: String, default: 'in_progress' })
    status: offboardingStatus

    @Prop({ default: true })
    isActive: boolean;

}

export const OffboardingSchema = SchemaFactory.createForClass(Offboarding);