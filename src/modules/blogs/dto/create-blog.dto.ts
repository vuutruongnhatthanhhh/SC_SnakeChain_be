import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateBlogDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'Url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'Hình ảnh không được để trống' })
  image: string;

  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @IsNotEmpty({ message: 'Tác giả không được để trống' })
  author: string;

  @IsOptional()
  isHide: boolean;
}
