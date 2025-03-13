import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImagesModule } from '../images/images.module';
import { Courses, CoursesSchema } from './schemas/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
    ImagesModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
