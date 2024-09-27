import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsBeforeDateConstraint implements ValidatorConstraintInterface {
    validate(endDate: Date, args: any) {
        const startDate = (args.object as any).start_date;
        return startDate && endDate && new Date(startDate) <= new Date(endDate);
    }

    defaultMessage() {
        return 'End date must be after start date';
    }
}

export function IsBeforeDate(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBeforeDateConstraint,
        });
    };
}
