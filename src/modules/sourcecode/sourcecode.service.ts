import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSourcecodeDto } from './dto/create-sourcecode.dto';
import { UpdateSourcecodeDto } from './dto/update-sourcecode.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SourceCode } from './schemas/sourcecode.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class SourcecodeService {
  constructor(
    @InjectModel(SourceCode.name)
    private sourcecodeModel: Model<SourceCode>,
  ) {}

  private deleteFile(filePath: string): void {
    const fileFullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fileFullPath)) {
      fs.unlinkSync(fileFullPath);
    }
  }

  // isCodeExist = async (code: string) => {
  //   const sourcecode = await this.sourcecodeModel.exists({ code });
  //   if (sourcecode) return true;
  //   return false;
  // };

  private async generateUniqueUrl(baseUrl: string): Promise<string> {
    let newUrl = baseUrl;
    let urlExists = await this.sourcecodeModel.findOne({ url: newUrl });

    let counter = 1;
    while (urlExists) {
      newUrl = `${baseUrl}-${counter}`;
      urlExists = await this.sourcecodeModel.findOne({ url: newUrl });
      counter++;
    }

    return newUrl;
  }

  async create(createSourcecodeDto: CreateSourcecodeDto) {
    const {
      code,
      title,
      url,
      stack,
      field,
      description,
      extendedDescription,
      price,
      originalPrice,
      image,
      extendedImage,
      linkDoc,
      linkYoutube,
      isHide,
    } = createSourcecodeDto;

    const uniqueUrl = await this.generateUniqueUrl(url);

    const sourcecode = await this.sourcecodeModel.create({
      code,
      title,
      url: uniqueUrl,
      stack,
      field,
      description,
      extendedDescription,
      price,
      originalPrice,
      image,
      extendedImage,
      linkDoc,
      linkYoutube,
      isHide,
    });
    return {
      _id: sourcecode._id,
    };
  }

  async findAll(
    query: string,
    current: number,
    pageSize: number,
    isHide: string,
    field: string,
  ) {
    let filter: Record<string, any> = {};

    if (query && query.trim() !== '') {
      filter.$or = [
        { code: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
      ];
    }

    if (isHide !== undefined) {
      filter.isHide = isHide === 'true';
    }
    console.log('field', field);

    if (field) {
      filter.field = field;
    }

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = await this.sourcecodeModel.find(filter).countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;

    const results = await this.sourcecodeModel
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

  async findAllInUser(query: string, field: string) {
    let filter: Record<string, any> = { isHide: false };

    if (query && query.trim() !== '') {
      filter.$or = [
        { code: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
      ];
    }

    if (field) {
      filter.field = field;
    }

    try {
      const results = await this.sourcecodeModel
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

  async countSourceCode(): Promise<number> {
    return this.sourcecodeModel.countDocuments();
  }

  // async findOne(id: string) {
  //   if (!mongoose.isValidObjectId(id)) {
  //     throw new BadRequestException('Id không đúng định dạng mongodb');
  //   }

  //   const sourcecode = await this.sourcecodeModel.findById(id);

  //   if (!sourcecode) {
  //     throw new BadRequestException('SourceCode không tồn tại');
  //   }

  //   return sourcecode;
  // }

  async findOne(url: string) {
    const sourcecode = await this.sourcecodeModel.findOne({ url });

    if (!sourcecode) {
      throw new BadRequestException('SourceCode không tồn tại');
    }

    return sourcecode;
  }

  async update(updateSourcecodeDto: UpdateSourcecodeDto) {
    const { _id, url, image, extendedImage } = updateSourcecodeDto;

    const sourcecode = await this.sourcecodeModel.findById(_id);
    if (!sourcecode) {
      throw new BadRequestException('SourceCode không tồn tại');
    }

    let updatedUrl = url;
    if (updatedUrl !== sourcecode.url) {
      updatedUrl = await this.generateUniqueUrl(updatedUrl);
    }

    // if (image !== sourcecode.image) {
    //   if (sourcecode.image) {
    //     this.deleteFile(`/${sourcecode.image}`);
    //   }
    // }

    // if (extendedImage && Array.isArray(extendedImage)) {
    //   if (sourcecode.extendedImage) {
    //     sourcecode.extendedImage.forEach((imagePath) => {
    //       if (!extendedImage.includes(imagePath)) {
    //         this.deleteFile(`/${imagePath}`);
    //       }
    //     });
    //   }
    // }

    return await this.sourcecodeModel.updateOne(
      { _id },
      {
        ...updateSourcecodeDto,
        url: updatedUrl,
      },
    );
  }

  async remove(_id: string) {
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('Id không đúng định dạng mongodb');
    }

    const sourcecode = await this.sourcecodeModel.findById(_id);
    if (!sourcecode) {
      throw new BadRequestException('SourceCode không tồn tại');
    }

    // if (sourcecode.image) {
    //   this.deleteFile(`/${sourcecode.image}`);
    // }

    // if (sourcecode.extendedImage && Array.isArray(sourcecode.extendedImage)) {
    //   sourcecode.extendedImage.forEach((image) => {
    //     this.deleteFile(`/${image}`);
    //   });
    // }

    return this.sourcecodeModel.deleteOne({ _id });
  }
}
