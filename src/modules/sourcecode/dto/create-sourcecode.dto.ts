import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateSourcecodeDto {
  @IsNotEmpty({ message: 'code không được để trống' })
  code: string;

  @IsNotEmpty({ message: 'title không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  @IsNotEmpty({ message: 'công nghệ sử dụng không được để trống' })
  stack: string;

  @IsOptional()
  field: string;

  @IsNotEmpty({ message: 'mô tả không được để trống' })
  description: string;

  @IsOptional()
  extendedDescription: string;

  @IsNotEmpty({ message: 'giá bán không được để trống' })
  price: Number;

  @IsOptional()
  originalPrice: Number;

  // @IsNotEmpty({ message: 'Hình đại diện không được để trống' })
  @IsOptional()
  image: string;

  @IsOptional()
  extendedImage: string[];

  @IsNotEmpty({ message: 'link doc không được để trống' })
  linkDoc: string;

  @IsNotEmpty({ message: 'link youtube không được để trống' })
  linkYoutube: string;

  @IsOptional()
  linkWebsite: string;

  @IsOptional()
  isHide: boolean;
}
