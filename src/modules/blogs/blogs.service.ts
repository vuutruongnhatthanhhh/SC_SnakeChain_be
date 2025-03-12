import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from './schemas/blogs.schema';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blogs.name)
    private blogsModel: Model<Blogs>,
  ) {}

  private async generateUniqueUrl(baseUrl: string): Promise<string> {
    let newUrl = baseUrl;
    let urlExists = await this.blogsModel.findOne({ url: newUrl });

    let counter = 1;
    while (urlExists) {
      newUrl = `${baseUrl}-${counter}`;
      urlExists = await this.blogsModel.findOne({ url: newUrl });
      counter++;
    }

    return newUrl;
  }

  private deleteFile(filePath: string): void {
    const fileFullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fileFullPath)) {
      fs.unlinkSync(fileFullPath);
    }
  }

  async create(createBlogDto: CreateBlogDto) {
    const { title, url, image, shortDescription, content, author, isHide } =
      createBlogDto;

    const uniqueUrl = await this.generateUniqueUrl(url);

    const blogs = await this.blogsModel.create({
      title,
      url: uniqueUrl,
      image,
      shortDescription,
      content,
      author,
      isHide,
    });
    return {
      _id: blogs._id,
    };
  }

  async findAll(
    query: string,
    current: number,
    pageSize: number,
    isHide: string,
  ) {
    let filter: Record<string, any> = {};

    if (query && query.trim() !== '') {
      filter.$or = [{ title: { $regex: query, $options: 'i' } }];
    }

    if (isHide !== undefined) {
      filter.isHide = isHide === 'true';
    }

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = await this.blogsModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const results = await this.blogsModel
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
      const results = await this.blogsModel
        .find(filter)
        .sort({ createdAt: -1 })
        .select('-updatedAt');

      return {
        results,
      };
    } catch (error) {
      throw new Error('Lỗi khi tìm kiếm dữ liệu');
    }
  }

  async findOne(url: string) {
    const blog = await this.blogsModel.findOne({ url });

    if (!blog) {
      throw new BadRequestException('SourceCode không tồn tại');
    }

    return blog;
  }

  async countBlog(): Promise<number> {
    return this.blogsModel.countDocuments();
  }

  async update(updateBlogDto: UpdateBlogDto) {
    const { _id, url, image } = updateBlogDto;

    const blog = await this.blogsModel.findById(_id);
    if (!blog) {
      throw new BadRequestException('Blog không tồn tại');
    }

    let updatedUrl = url;
    if (updatedUrl !== blog.url) {
      updatedUrl = await this.generateUniqueUrl(updatedUrl);
    }

    return await this.blogsModel.updateOne(
      { _id },
      {
        ...updateBlogDto,
        url: updatedUrl,
      },
    );
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Id không đúng định dạng mongodb');
    }

    const blog = await this.blogsModel.findById(_id);
    if (!blog) {
      throw new BadRequestException('Blog không tồn tại');
    }

    return this.blogsModel.deleteOne({ _id });
  }
}
