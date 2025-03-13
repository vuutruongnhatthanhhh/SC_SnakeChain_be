import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from './schemas/courses.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Courses.name)
    private coursesModel: Model<Courses>,
  ) {}

  private async generateUniqueUrl(baseUrl: string): Promise<string> {
    let newUrl = baseUrl;
    let urlExists = await this.coursesModel.findOne({ url: newUrl });

    let counter = 1;
    while (urlExists) {
      newUrl = `${baseUrl}-${counter}`;
      urlExists = await this.coursesModel.findOne({ url: newUrl });
      counter++;
    }

    return newUrl;
  }

  async create(createCourseDto: CreateCourseDto) {
    const { title, url, image, shortDescription, category, isHide, lessons } =
      createCourseDto;

    const uniqueUrl = await this.generateUniqueUrl(url);

    const courses = await this.coursesModel.create({
      title,
      url: uniqueUrl,
      image,
      shortDescription,
      category,
      isHide,
      lessons,
    });
    return {
      _id: courses._id,
    };
  }

  async findAll(
    query: string,
    current: number,
    pageSize: number,
    isHide: string,
    category: string,
  ) {
    let filter: Record<string, any> = {};

    if (query && query.trim() !== '') {
      filter.$or = [{ title: { $regex: query, $options: 'i' } }];
    }

    if (isHide !== undefined) {
      filter.isHide = isHide === 'true';
    }

    if (category) {
      filter.category = category;
    }

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = await this.coursesModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const results = await this.coursesModel
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

  async findAllInUser(query: string, category: string) {
    let filter: Record<string, any> = { isHide: false };

    if (query && query.trim() !== '') {
      filter.$or = [{ title: { $regex: query, $options: 'i' } }];
    }

    if (category) {
      filter.category = category;
    }

    try {
      const results = await this.coursesModel
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

  async countCourses(): Promise<number> {
    return this.coursesModel.countDocuments();
  }

  async findOne(url: string) {
    const course = await this.coursesModel.findOne({ url });

    if (!course) {
      throw new BadRequestException('Course không tồn tại');
    }

    return course;
  }

  async update(updateCourseDto: UpdateCourseDto) {
    const { _id, url } = updateCourseDto;

    const course = await this.coursesModel.findById(_id);
    if (!course) {
      throw new BadRequestException('Course không tồn tại');
    }

    let updatedUrl = url;
    if (updatedUrl !== course.url) {
      updatedUrl = await this.generateUniqueUrl(updatedUrl);
    }
    return await this.coursesModel.updateOne(
      { _id },
      {
        ...updateCourseDto,
        url: updatedUrl,
      },
    );
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Id không đúng định dạng mongodb');
    }

    const course = await this.coursesModel.findById(_id);
    if (!course) {
      throw new BadRequestException('Course không tồn tại');
    }

    return this.coursesModel.deleteOne({ _id });
  }
}
