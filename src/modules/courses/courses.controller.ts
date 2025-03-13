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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Public, Roles } from '@/decorator/customize';
import { RolesGuard } from '@/auth/passport/roles.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  findAll(
    @Query('query') query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('isHide') isHide: string,
    @Query('category') category: string,
  ) {
    return this.coursesService.findAll(
      query,
      +current,
      +pageSize,
      isHide,
      category,
    );
  }

  @Get('/userCourses')
  @Public()
  findAllInUser(
    @Query('query') query: string,
    @Query('category') category: string,
  ) {
    return this.coursesService.findAllInUser(query, category);
  }

  @Get('count/count')
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  async countCourses() {
    const totalCourses = await this.coursesService.countCourses();
    return { totalCourses };
  }

  @Get(':url')
  @Public()
  findOne(@Param('url') url: string) {
    return this.coursesService.findOne(url);
  }

  @Patch()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  update(@Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(updateCourseDto);
  }

  @Delete(':id')
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
