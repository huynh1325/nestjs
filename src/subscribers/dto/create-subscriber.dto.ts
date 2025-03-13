import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsEmail({}, {message: 'Email không đúng định dạng'})
    @IsNotEmpty({ message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({ message: 'skill không được để trống'})
    @IsArray({ message: 'skill có định đạng là array'})
    @IsString({ each: true, message: 'skill định dạng là string'})
    skills: string[];
}
