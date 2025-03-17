import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { Public } from '@/decorator/customize';

@Public()
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('quoteRequest')
  async quoteRequest(@Body() formData: any) {
    return this.mailService.sendQuoteRequest(formData);
  }

  @Post('contactRequest')
  async contactRequest(@Body() formData: any) {
    return this.mailService.sendContactRequest(formData);
  }

  @Post()
  create(@Body() createMailDto: CreateMailDto) {
    return this.mailService.create(createMailDto);
  }

  @Get()
  findAll() {
    return this.mailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMailDto: UpdateMailDto) {
    return this.mailService.update(+id, updateMailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailService.remove(+id);
  }
}
