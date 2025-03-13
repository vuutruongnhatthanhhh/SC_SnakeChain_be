import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Public, Roles } from '@/decorator/customize';
import { RolesGuard } from '@/auth/passport/roles.guard';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  findAll(
    @Query('query') query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('isHide') isHide: string,
    @Query('course') course: string,
  ) {
    return this.lessonsService.findAll(
      query,
      +current,
      +pageSize,
      isHide,
      course,
    );
  }

  @Get('/userLessons')
  @Public()
  findAllInUser(@Query('query') query: string) {
    return this.lessonsService.findAllInUser(query);
  }

  @Get('count/count')
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  async countLessons() {
    const totalLessons = await this.lessonsService.countLessons();
    return { totalLessons };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.lessonsService.findOne(+id);
  // }

  @Patch()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  update(@Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(updateLessonDto);
  }

  @Delete(':id')
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
