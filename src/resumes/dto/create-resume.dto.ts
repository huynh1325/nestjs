import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";


export class CreateResumeDto {
    @IsNotEmpty({message: "email ko được để trống"})
    email: string;
    
    @IsNotEmpty({message: "userId ko được để trống"})
    userId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({message: "url ko được để trống"})
    url: string;

    @IsNotEmpty({message: "status ko được để trống"})
    status: string;

    @IsNotEmpty({message: "companyId ko được để trống"})
    companyId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({message: "jobId ko được để trống"})
    jobId: mongoose.Schema.Types.ObjectId
}

export class CreateUserCvDto {
    @IsNotEmpty({message: "url ko được để trống"})
    url: string

    @IsNotEmpty({message: "companyId ko được để trống"})
    @IsMongoId({message: "companyId is a mongo id"})
    companyId: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({message: "jobId ko được để trống"})
    @IsMongoId({message: "jobId is a mongo id"})
    jobId: mongoose.Schema.Types.ObjectId
}
