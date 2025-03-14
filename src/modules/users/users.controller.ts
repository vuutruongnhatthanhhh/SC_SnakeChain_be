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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@/decorator/customize';
import { RolesGuard } from '@/auth/passport/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  async findAll(
    @Query('query') query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('role') role: string,
    @Query('accountType') accountType: string,
    @Query('isActive') isActive: string,
  ) {
    return this.usersService.findAll(
      query,
      +current,
      +pageSize,
      role,
      accountType,
      isActive,
    );
  }

  @Get('count')
  @Roles('SNAKE', 'WORM')
  @UseGuards(RolesGuard)
  async countUsers() {
    const totalUsers = await this.usersService.countUsers();
    return { totalUsers };
  }

  @Patch()
  @Roles('SNAKE')
  @UseGuards(RolesGuard)
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Patch('updateProfile')
  updateProfile(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @Roles('SNAKE') //role user must SNAKE to call api
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
