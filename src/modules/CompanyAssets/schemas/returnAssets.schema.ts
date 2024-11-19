import { Injectable } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from 'src/modules/user/schemas/user.schema';
import { Assets } from './assets.schema';
import { RETURN_ASSET_STATUS } from 'src/utils/constant';

type returnAssetStatus = typeof RETURN_ASSET_STATUS[number];

@Injectable()
@Schema()
export class ReturnedAssets extends Document {
    @Prop({ type: Types.ObjectId, ref: Assets.name, required: true })
    asset_id: string;

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    employee_id: string;

    @Prop({ type: String, required: true })
    return_date: Date;

    @Prop({ type: String, required: true })
    condition_report: string;

    @Prop({ type: String, default: 'pending', enum: RETURN_ASSET_STATUS })
    status: returnAssetStatus

    @Prop({ type: String, required: true })
    serial_number: string;

    @Prop({ type: String, required: true })
    inspection_notes: string;

    @Prop({ type: Number, required: true })
    deduction_amount: number;
}

export const AssetsReturnedDataSchema = SchemaFactory.createForClass(ReturnedAssets);
