import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
export class CreateLessonDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @IsNotEmpty({ message: 'Link video không được để trống' })
  videoUrl: string;

  @IsOptional()
  price: Number;

  @IsOptional()
  isHide: boolean;

  //   @IsArray()
  @IsOptional()
  course?: Types.ObjectId;
}
