import { Injectable } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { LeaveTypes } from "./leaveTypes.schema";

@Injectable()
@Schema()
export class LeavePolicies extends Document {

    @Prop({ type: Types.ObjectId, ref: LeaveTypes.name, required: true })
    leave_type_id: string;

    @Prop({ type: Number, required: true })
    max_leaves_per_year: number

    @Prop({ type: Number, required: true })
    max_leaves: number

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const LeavePolicySchema = SchemaFactory.createForClass(LeavePolicies)