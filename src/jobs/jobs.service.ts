import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
    ) {}

    async create(createJobDto: CreateJobDto, user: IUser) {
        const { name, skills, salary, quantity, level, description, startDate, endDate, company, isActive, location } =
            createJobDto;
    
        let newJob = await this.jobModel.create({
            name,
            skills,
            salary,
            quantity,
            level,
            description,
            startDate,
            endDate,
            company,
            isActive,
            location,
            createdBy: {
                _id: user._id,
                email: user.email
            }
        });
        return newJob;
    }

    async findAll(currentPage: number, limit: number, qs: string) {
      const { filter, sort, population } = aqp(qs);
      delete filter.current;
      delete filter.pageSize;
  
      let offset = (+currentPage - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;
  
      const totalItems = (await this.jobModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
  
      const result = await this.jobModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any)
        .populate(population)
        .exec();
  
      return {
        meta: {
          current: currentPage,
          pageSize: limit,
          pages: totalPages,
          total: totalItems,
        },
        result
      };
    }

    async findOne(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) return 'not found job'
        return await this.jobModel.findById(id)
    }

    update(id: string, updateJobDto: UpdateJobDto, user) {
        return this.jobModel.updateOne(
            { _id: id },
            {
              ...updateJobDto,
              updateBy: {
                _id: user._id,
                email: user.email,
              },
            },
        )
    }

    async remove(_id: string, user) {
        if (!mongoose.Types.ObjectId.isValid( _id ))
        await this.jobModel.updateOne(
          {
            _id
          },
          {
            deletedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        );
        return this.jobModel.softDelete({ _id });
    }
}
