import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nhatthanh28012002@gmail.com', // Thay bằng email của bạn
      pass: 'strmpymhgrjismwn', // Dùng App Password nếu dùng Gmail
    },
  });

  create(createMailDto: CreateMailDto) {
    return 'This action adds a new mail';
  }

  findAll() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }

  async sendQuoteRequest(formData: any) {
    const uniqueId = uuidv4();
    const mailOptions = {
      from: formData.email,
      to: 'vuutruongnhatthanh@gmail.com',
      subject: `Yêu cầu báo giá mới - ${uniqueId}`,
      text: `
        Họ tên: ${formData.name}
        Email: ${formData.email}
        Số điện thoại: ${formData.phone}
        Ngân sách: ${formData.budget}
        Mô tả: ${formData.description}
      `,
    };

    await this.transporter.sendMail(mailOptions);
    return { message: 'Gửi yêu cầu thành công. Cảm ơn bạn' };
  }

  async sendContactRequest(formData: any) {
    const uniqueId = uuidv4();
    const mailOptions = {
      from: formData.email,
      to: 'vuutruongnhatthanh@gmail.com',
      subject: `Yêu cầu liên hệ mới - ${uniqueId}`,
      text: `
        Họ tên: ${formData.name}
        Email: ${formData.email}
        Số điện thoại: ${formData.phone}     
        Tin nhắn: ${formData.message}
      `,
    };

    await this.transporter.sendMail(mailOptions);
    return { message: 'Gửi tin nhắn thành công. Cảm ơn bạn' };
  }
}
