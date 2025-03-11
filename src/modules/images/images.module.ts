import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController, UploadImageController } from './images.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Images, ImagesSchema } from './schemas/images.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Images.name, schema: ImagesSchema }]),
  ],
  controllers: [ImagesController, UploadImageController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
