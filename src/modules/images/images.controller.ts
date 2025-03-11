import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Roles } from '@/decorator/customize';
import { RolesGuard } from '@/auth/passport/roles.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Controller('uploadImage')
export class UploadImageController {
  constructor(private readonly imagesService: ImagesService) {}
  @Post()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const folderName = req.query.folderName as string;
          const uploadPath = path.join(process.cwd(), folderName);
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: async (req, file, cb) => {
          let originalName = file.originalname;
          let fileExtension = path.extname(originalName);
          let baseName = path.basename(originalName, fileExtension);

          let uniqueName = baseName;
          let counter = 1;
          let uploadPath = path.join(
            process.cwd(),
            req.query.folderName as string,
            uniqueName + fileExtension,
          );

          while (fs.existsSync(uploadPath)) {
            uniqueName = `${baseName}-${counter}`;
            uploadPath = path.join(
              process.cwd(),
              req.query.folderName as string,
              uniqueName + fileExtension,
            );
            counter++;
          }

          cb(null, uniqueName + fileExtension);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folderName') folderName: string,
  ) {
    const createImageDto: CreateImageDto = {
      name: `/${folderName}/${file.filename}`,
      category: `${folderName}`,
    };

    const createdImage = await this.imagesService.create(createImageDto);

    return {
      success: true,
      imagePath: `/${folderName}/${file.filename}`,
      image: createdImage,
    };
  }

  // @Post('multiple')
  // @Roles('SNAKE')
  // @UseGuards(RolesGuard)
  // @UseInterceptors(
  //   FilesInterceptor('images', 10, {
  //     storage: multer.diskStorage({
  //       destination: (req, file, cb) => {
  //         const uploadPath = path.join(process.cwd(), 'uploadBlog');
  //         if (!fs.existsSync(uploadPath)) {
  //           fs.mkdirSync(uploadPath, { recursive: true });
  //         }
  //         cb(null, uploadPath);
  //       },
  //       filename: (req, file, cb) => {
  //         let uniqueName = uuidv4() + path.extname(file.originalname);

  //         const filePath = path.join(process.cwd(), 'uploadBlog', uniqueName);
  //         if (fs.existsSync(filePath)) {
  //           uniqueName = uuidv4() + path.extname(file.originalname);
  //         }

  //         cb(null, uniqueName);
  //       },
  //     }),
  //   }),
  // )
  // async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   const filePaths = files.map((file) => `/uploadBlog/${file.filename}`);
  //   return { success: true, imagePaths: filePaths };
  // }

  @Delete(':filename')
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  async deleteFile(
    @Param('filename') filename: string,
    @Body() body: { folderName: string },
  ) {
    const { folderName } = body;
    try {
      const filePath = path.join(process.cwd(), folderName, filename);

      // Kiểm tra xem file có tồn tại không
      if (!fs.existsSync(filePath)) {
        return { success: false, message: 'File không tồn tại' };
      }

      // Xóa file
      fs.unlinkSync(filePath);

      const result = await this.imagesService.remove(
        `/${folderName}/` + filename,
      );

      if (!result.deletedCount) {
        throw new BadRequestException('Không thể xóa ảnh khỏi cơ sở dữ liệu');
      }

      return {
        success: true,
        message: 'File và thông tin ảnh trong DB đã được xóa thành công',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Đã xảy ra lỗi khi xóa file',
        error: error.message,
      };
    }
  }
}

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Get()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  findAll(
    @Query('query') query: string,
    // @Query('current') current: string,
    // @Query('pageSize') pageSize: string,
    @Query('category') category: string,
  ) {
    return this.imagesService.findAll(query, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  remove(@Body('name') name: string) {
    return this.imagesService.remove(name);
  }
}
