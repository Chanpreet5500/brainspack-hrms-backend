import { Injectable } from '@nestjs/common';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HOLIDAYTYPE } from 'src/utils/constant';


type holidayType = typeof HOLIDAYTYPE[number];
@Injectable()
@Schema()
export class Holidays extends Document {

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: Date, required: true })
    date: Date

    @Prop({ type: String, required: true, enum: HOLIDAYTYPE })
    type: holidayType

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId })
    createdBy: string;

    @Prop({ type: MongooseSchema.Types.ObjectId })
    updatedBy: string;

}

export const HolidaySchema = SchemaFactory.createForClass(Holidays);