import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogsSchema } from './schemas/blogs.schema';
import { ImagesModule } from '../images/images.module';
import { ImagesService } from '../images/images.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blogs.name, schema: BlogsSchema }]),
    ImagesModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
