import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export function validateObjectId(id: string, fieldName: string = 'ID'): void {
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid ${fieldName}: ${id}`);
    }
}
