import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
      @InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}


  async create(createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
      const { name, email, skills } = createSubscriberDto;
  
      const isExist = await this.subscriberModel.findOne({ email })
      if (isExist) {
        throw new BadRequestException(`Email: ${email} đã tồn tại trên hệ thống!`);
      }
  
      const newSub = await this.subscriberModel.create({
        name, email, skills,
        createdBy: {
          _id: user._id,
          email: user.email
        }
      })
      
      return {
        _id: newSub?._id,
        createdAt: newSub?.createdAt
      }
    }

    async findAll(currentPage: number, limit: number, qs: string) {
      const { filter, sort, population } = aqp(qs);
      delete filter.current;
      delete filter.pageSize;
  
      let offset = (+currentPage - 1) * +limit;
      let defaultLimit = +limit ? +limit : 10;
  
      const totalItems = (await this.subscriberModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);
  
      const result = await this.subscriberModel
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
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`not found subscriber`)
      }
      return await this.subscriberModel.findOne({_id: id})
    }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`not found subscriber`)
      }

      const { name, email, skills } = updateSubscriberDto;

      const updated = await this.subscriberModel.updateOne(
        { _id: id },
        {
          name, email, skills,
          updateBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
      
      return updated;
    }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found subscriber`)
    }

      await this.subscriberModel.updateOne(
        {
          _id: id,
        },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );
      return this.subscriberModel.softDelete({
        _id: id,
      });
    }
}
