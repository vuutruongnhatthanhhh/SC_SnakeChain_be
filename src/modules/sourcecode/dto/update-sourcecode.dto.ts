import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSourcecodeDto {
  @IsMongoId({ message: '_id không hợp lệ' })
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;

  @IsOptional()
  code: string;

  @IsOptional()
  title: string;

  @IsOptional()
  url: string;

  @IsOptional()
  stack: string;

  @IsOptional()
  field: string;

  @IsOptional()
  description: string;

  @IsOptional()
  extendedDescription: string;

  @IsOptional()
  price: Number;

  @IsOptional()
  originalPrice: Number;

  @IsOptional()
  image: string;

  @IsOptional()
  extendedImage: string[];

  @IsOptional()
  linkDoc: string;

  @IsOptional()
  linkYoutube: string;

  @IsOptional()
  linkWebsite: string;

  @IsOptional()
  isHide: boolean;
}
