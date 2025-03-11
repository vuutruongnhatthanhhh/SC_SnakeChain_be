import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateImageDto {
  @IsNotEmpty({ message: 'Tên ảnh không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Loại ảnh không được để trống' })
  category: string;
}
