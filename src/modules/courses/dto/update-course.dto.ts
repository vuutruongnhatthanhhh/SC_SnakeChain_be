import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCourseDto {
  @IsMongoId({ message: '_id không hợp lệ' })
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;

  @IsOptional()
  title: string;

  @IsOptional()
  url: string;

  @IsOptional()
  image: string;

  @IsOptional()
  shortDescription: string;

  @IsOptional()
  category: string;

  @IsOptional()
  isHide: boolean;

  //   @IsArray()
  @IsOptional()
  lessons?: Types.ObjectId[];
}
