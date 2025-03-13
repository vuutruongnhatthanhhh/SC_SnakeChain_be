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
import { SourcecodeService } from './sourcecode.service';
import { CreateSourcecodeDto } from './dto/create-sourcecode.dto';
import { UpdateSourcecodeDto } from './dto/update-sourcecode.dto';
import { Public, Roles } from '@/decorator/customize';
import { RolesGuard } from '@/auth/passport/roles.guard';

@Controller('sourcecode')
export class SourcecodeController {
  constructor(private readonly sourcecodeService: SourcecodeService) {}

  @Post()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  create(@Body() createSourcecodeDto: CreateSourcecodeDto) {
    return this.sourcecodeService.create(createSourcecodeDto);
  }

  @Get()
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  findAll(
    @Query('query') query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('isHide') isHide: string,
    @Query('field') field: string,
  ) {
    return this.sourcecodeService.findAll(
      query,
      +current,
      +pageSize,
      isHide,
      field,
    );
  }

  @Get('/userCode')
  @Public()
  findAllInUser(@Query('query') query: string, @Query('field') field: string) {
    return this.sourcecodeService.findAllInUser(query, field);
  }

  @Get('count/count')
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  async countUsers() {
    const totalSourceCode = await this.sourcecodeService.countSourceCode();
    return { totalSourceCode };
  }

  // @Public()
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sourcecodeService.findOne(id);
  // }

  @Public()
  @Get(':url')
  findOne(@Param('url') url: string) {
    return this.sourcecodeService.findOne(url);
  }

  @Patch()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  update(@Body() updateSourcecodeDto: UpdateSourcecodeDto) {
    return this.sourcecodeService.update(updateSourcecodeDto);
  }

  @Delete(':id')
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.sourcecodeService.remove(id);
  }
}
