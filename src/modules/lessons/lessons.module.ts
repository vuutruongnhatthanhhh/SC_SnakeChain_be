import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lessons, LessonsSchema } from './schemas/lessons.schema';
import { CoursesModule } from '../courses/courses.module';
import { Courses, CoursesSchema } from '../courses/schemas/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lessons.name, schema: LessonsSchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CoursesSchema }]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
