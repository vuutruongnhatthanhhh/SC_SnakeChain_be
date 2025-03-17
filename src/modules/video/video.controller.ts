import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Header,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Response, Request } from 'express';
import { Public } from '@/decorator/customize';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from '../users/users.service';

@Controller('video')
export class VideoController {
  private videoDir = path.join(process.cwd(), 'uploadVideo');
  constructor(
    private readonly videoService: VideoService,
    private readonly userService: UsersService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploadVideo');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          let originalName = file.originalname;
          let fileExtension = path.extname(originalName);
          let baseName = path.basename(originalName, fileExtension);
          let safeBaseName = baseName.replace(/\s+/g, '_');

          let uniqueName = safeBaseName;
          let counter = 1;
          let uploadDir = path.join(process.cwd(), 'uploadVideo');
          let uploadPath = path.join(uploadDir, uniqueName + fileExtension);

          while (fs.existsSync(uploadPath)) {
            uniqueName = `${safeBaseName}-${counter}`;
            uploadPath = path.join(uploadDir, uniqueName + fileExtension);
            counter++;
          }

          cb(null, uniqueName + fileExtension);
        },
      }),
      limits: { fileSize: 500 * 1024 * 1024 }, // limit video 500MB
    }),
  )
  uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Upload thành công!',
      filePath: `/video/${file.filename}`,
    };
  }

  @Public()
  @Get(':filename/:lessonId/:userId')
  async streamVideo(
    @Param('filename') filename: string,
    @Param('lessonId') lessonId: string,
    @Param('userId') userId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    //  check user has access to video
    // const userHasAccess = true;
    const userHasAccess = await this.userService.hasLesson(userId, lessonId);

    if (!userHasAccess) {
      throw new HttpException(
        'Bạn phải trả phí để xem video này',
        HttpStatus.FORBIDDEN,
      );
    }

    const videoPath = path.join(this.videoDir, filename);
    if (!fs.existsSync(videoPath)) {
      throw new HttpException('Video không tồn tại', HttpStatus.NOT_FOUND);
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.status(416).send('Requested Range Not Satisfiable');
        return;
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(videoPath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });

      fs.createReadStream(videoPath).pipe(res);
    }
  }
}
