import { Injectable } from '@nestjs/common';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from 'src/modules/user/schemas/user.schema';

@Injectable()
@Schema()
export class Projects extends Document {

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Date, required: true })
    start_date: Date

    @Prop({ type: Date, required: true })
    end_date: Date

    @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
    assigned_by: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: Users.name }], required: true })
    assigned_to: Types.ObjectId[];

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

    @Prop({ type: Types.ObjectId, ref: Users.name })
    createdBy: string;

    @Prop({ type: Types.ObjectId, ref: Users.name })
    updatedBy: string;

}

export const ProjectSchema = SchemaFactory.createForClass(Projects);