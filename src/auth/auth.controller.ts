import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import {
  ChangePasswordAuthDto,
  ChangePasswordProfileDto,
  CodeAuthDto,
  CreateAuthDto,
} from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '@/modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
  ) {}

  // @Get('mail')
  // @Public()
  // testMail() {
  //   this.mailerService.sendMail({
  //     to: 'itnap@ngananhphat.com',
  //     subject: 'NAP',
  //     text: 'Chào mừng đến với NAP',
  //     template: 'nap',
  //     context: {
  //       name: 'Nhật Thanh',
  //       activationCode: 123456789,
  //     },
  //   });
  //   return 'ok';
  // }

  @Post('send-email')
  @Public()
  async sendEmail(@Body() data: { email: string }) {
    const { email } = data;

    try {
      await this.mailerService.sendMail({
        to: email, // Email người nhận
        subject: 'NAP', // Tiêu đề email

        template: 'nap', // Bạn có thể sử dụng template trong thư mục views nếu cần
      });

      return { message: 'Email đã được gửi thành công!' };
    } catch (error) {
      return { message: 'Đã xảy ra lỗi khi gửi email.', error: error.message };
    }
  }

  @Post('login')
  // not protect this route (use public)
  // don't need to check token
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Fetch login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() registerDto: CodeAuthDto) {
    return this.authService.checkCode(registerDto);
  }

  @Post('retry-active')
  @Public()
  retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body('email') email: string) {
    return this.authService.retryPassword(email);
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }

  @Post('change-password-profile')
  changePasswordProfile(@Body() data: ChangePasswordProfileDto) {
    return this.authService.changePasswordProfile(data);
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Get(':id')
  profile(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
