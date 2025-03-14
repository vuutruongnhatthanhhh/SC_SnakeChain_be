import { IsNotEmpty, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateLessonDto {
  @IsMongoId({ message: '_id không hợp lệ' })
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;

  @IsOptional()
  title: string;

  @IsOptional()
  content: string;

  @IsOptional()
  videoUrl: string;

  @IsOptional()
  price: Number;

  @IsOptional()
  isHide: boolean;
}
