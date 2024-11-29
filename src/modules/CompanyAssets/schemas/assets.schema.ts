import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from 'src/modules/user/schemas/user.schema';
import { ASSETSTATUS } from 'src/utils/constant';


type assetStatus = typeof ASSETSTATUS[number];

@Injectable()
@Schema({ timestamps: true })
export class Assets extends Document {

    @Prop({ type: String, required: true })
    type: string;

    @Prop({ type: String, required: true })
    serial_number: string;

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    assigned_to: string;

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    assigned_by: string;

    @Prop({ type: String, required: true })
    condition: string;

    @Prop({ type: String, default: 'assigned', enum: ASSETSTATUS })
    status: assetStatus

    @Prop({ type: Date, required: true })
    purchase_date: Date;

    @Prop({ type: Date, required: true })
    return_due_date: Date;
}

export const AssetsDataSchema = SchemaFactory.createForClass(Assets);
