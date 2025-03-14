import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lessons } from './schemas/lessons.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lessons.name)
    private lessonsModel: Model<Lessons>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    const { title, content, videoUrl, price, isHide } = createLessonDto;

    const lessons = await this.lessonsModel.create({
      title,
      content,
      videoUrl,
      price,
      isHide,
    });
    return {
      _id: lessons._id,
    };
  }

  async findAll(
    query: string,
    current: number,
    pageSize: number,
    isHide: string,
    course: string,
  ) {
    let filter: Record<string, any> = {};

    if (query && query.trim() !== '') {
      filter.$or = [{ title: { $regex: query, $options: 'i' } }];
    }

    if (isHide !== undefined) {
      filter.isHide = isHide === 'true';
    }

    if (course) {
      filter.course = course;
    }

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = await this.lessonsModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const results = await this.lessonsModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort({ createdAt: -1 });

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results,
    };
  }

  async findAllInUser(query: string) {
    let filter: Record<string, any> = { isHide: false };

    if (query && query.trim() !== '') {
      filter.$or = [{ title: { $regex: query, $options: 'i' } }];
    }

    try {
      const results = await this.lessonsModel
        .find(filter)
        .sort({ createdAt: -1 })
        .select('-updatedAt -createdAt ');

      return {
        results,
      };
    } catch (error) {
      throw new Error('Lỗi khi tìm kiếm dữ liệu');
    }
  }

  async countLessons(): Promise<number> {
    return this.lessonsModel.countDocuments();
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Id không đúng định dạng MongoDB');
    }

    const lesson = await this.lessonsModel.findById(id);
    if (!lesson) {
      throw new BadRequestException('Lesson không tồn tại');
    }

    return lesson;
  }
  async update(updateLessonDto: UpdateLessonDto) {
    const { _id } = updateLessonDto;

    const lessons = await this.lessonsModel.findById(_id);
    if (!lessons) {
      throw new BadRequestException('Lessons không tồn tại');
    }

    return await this.lessonsModel.updateOne(
      { _id },
      {
        ...updateLessonDto,
      },
    );
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Id không đúng định dạng mongodb');
    }

    const lesson = await this.lessonsModel.findById(_id);
    if (!lesson) {
      throw new BadRequestException('Lesson không tồn tại');
    }

    return this.lessonsModel.deleteOne({ _id });
  }
}
