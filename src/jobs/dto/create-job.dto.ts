import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsArray({ message: "Skill có định dạng là array"})
    @IsString({ each: true, message: "Skill phải là string" })
    @IsNotEmpty({ message: 'Skill không được để trống' })
    skills: string[];

    @IsNotEmpty({ message: 'Salary không được để trống' })
    salary: number;

    @IsNotEmpty({ message: 'Quantity không được để trống' })
    quantity: number;

    @IsNotEmpty({ message: 'Level không được để trống' })
    level: string;

    @IsNotEmpty({ message: 'Description không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'StardDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "startDate phải có định dạng là Date" })
    startDate: Date;

    @IsNotEmpty({ message: 'EndDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "endDate phải có định dạng là Date" })
    endDate: Date;

    @IsNotEmpty({ message: 'IsActive không được để trống' })
    @IsBoolean({ message: 'isActive phải là boolean'})
    isActive: Date;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}
