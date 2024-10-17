import { Injectable } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Users } from "src/modules/user/schemas/user.schema";
import { LeaveTypes } from "./leaveTypes.schema";

@Injectable()
@Schema()
export class LeaveBalance extends Document {

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    user_id: string;

    @Prop({ type: Types.ObjectId, ref: LeaveTypes.name, required: true })
    leave_type_id: string;

    @Prop({ type: Number, required: true })
    total_allocated: number

    @Prop({ type: Number, default: 0 })
    total_used: number

    @Prop({ type: Number, default: 0 })
    total_encashed: number
}

export const LeaveBalanceSchema = SchemaFactory.createForClass(LeaveBalance)