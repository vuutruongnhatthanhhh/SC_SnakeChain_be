import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
export class CreateCourseDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'Url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'Hình ảnh không được để trống' })
  image: string;

  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  shortDescription: string;

  @IsNotEmpty({ message: 'Loại không được để trống' })
  category: string;

  @IsOptional()
  isHide: boolean;

  //   @IsArray()
  @IsOptional()
  lessons?: Types.ObjectId[];
}
