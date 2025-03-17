import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsMongoId({ message: '_id không hợp lệ' })
  @IsNotEmpty({ message: '_id không được để trống' })
  _id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsOptional()
  image: string;

  @IsOptional()
  role: string;

  @IsOptional()
  lessons?: Types.ObjectId[];
}
