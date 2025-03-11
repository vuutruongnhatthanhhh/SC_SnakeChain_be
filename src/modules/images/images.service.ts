import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Images } from './schemas/images.schema';
import mongoose from 'mongoose';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Images.name)
    private imagesModel: Model<Images>,
  ) {}

  async create(createImageDto: CreateImageDto) {
    const { name, category } = createImageDto;

    const image = await this.imagesModel.create({
      name,
      category,
    });
    return {
      _id: image._id,
    };
  }

  async findAll(query: string, category: string) {
    try {
      let filter: Record<string, any> = {};

      if (query && query.trim() !== '') {
        filter.$or = [{ name: { $regex: query, $options: 'i' } }];
      }

      if (category !== undefined) {
        filter.category = category;
      }

      const results = await this.imagesModel
        .find(filter)
        .sort({ createdAt: -1 });

      return { success: true, data: results };
    } catch (error) {
      throw new BadRequestException(
        'Lỗi khi truy vấn dữ liệu ảnh',
        error.message,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  async remove(name: string) {
    if (!name) {
      throw new BadRequestException('Filename không hợp lệ');
    }

    // Tìm ảnh theo filename trong cơ sở dữ liệu và xóa nó
    const image = await this.imagesModel.findOne({ name }); // Giả sử bạn lưu filename trong db
    if (!image) {
      throw new BadRequestException('Image không tồn tại');
    }

    return this.imagesModel.deleteOne({ name });
  }

  async findByName(name: string): Promise<Images | null> {
    return this.imagesModel.findOne({ name }).exec();
  }
}
