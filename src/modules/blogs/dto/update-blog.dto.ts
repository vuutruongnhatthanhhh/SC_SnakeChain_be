import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBlogDto {
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
  content: string;

  @IsOptional()
  author: string;

  @IsOptional()
  isHide: boolean;
}
