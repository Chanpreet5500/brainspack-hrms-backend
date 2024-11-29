import { Injectable } from "@nestjs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Injectable()
@Schema()
export class LeaveTypes extends Document {

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveTypes)