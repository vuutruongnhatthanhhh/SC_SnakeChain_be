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
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { SourcecodeService } from './sourcecode.service';
import { CreateSourcecodeDto } from './dto/create-sourcecode.dto';
import { UpdateSourcecodeDto } from './dto/update-sourcecode.dto';
import { Public, Roles } from '@/decorator/customize';
import { RolesGuard } from '@/auth/passport/roles.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as multer from 'multer';

@Controller('upload')
export class UploadController {
  @Post()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploadSourceCode');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          let uniqueName = uuidv4() + path.extname(file.originalname);

          const filePath = path.join(
            process.cwd(),
            'uploadSourceCode',
            uniqueName,
          );
          if (fs.existsSync(filePath)) {
            uniqueName = uuidv4() + path.extname(file.originalname);
          }

          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { success: true, imagePath: `/uploadSourceCode/${file.filename}` };
  }

  @Post('multiple')
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploadSourceCode');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          let uniqueName = uuidv4() + path.extname(file.originalname);

          const filePath = path.join(
            process.cwd(),
            'uploadSourceCode',
            uniqueName,
          );
          if (fs.existsSync(filePath)) {
            uniqueName = uuidv4() + path.extname(file.originalname);
          }

          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    const filePaths = files.map((file) => `/uploadSourceCode/${file.filename}`);
    return { success: true, imagePaths: filePaths };
  }
}

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

  @Get('count')
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
