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
