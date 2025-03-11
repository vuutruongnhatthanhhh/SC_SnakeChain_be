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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Public, Roles } from '@/decorator/customize';
import { RolesGuard } from '@/auth/passport/roles.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  findAll(
    @Query('query') query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('isHide') isHide: string,
  ) {
    return this.blogsService.findAll(query, +current, +pageSize, isHide);
  }

  @Get('/userBlog')
  @Public()
  findAllInUser(@Query('query') query: string) {
    return this.blogsService.findAllInUser(query);
  }

  @Public()
  @Get(':url')
  findOne(@Param('url') url: string) {
    return this.blogsService.findOne(url);
  }

  @Get('count/count')
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  async countBlogs() {
    const totalBlogs = await this.blogsService.countBlog();
    return { totalBlogs };
  }

  @Patch()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  update(@Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(updateBlogDto);
  }

  @Delete(':id')
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
