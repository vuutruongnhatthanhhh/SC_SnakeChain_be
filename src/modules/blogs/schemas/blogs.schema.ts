import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogsDocument = HydratedDocument<Blogs>;

@Schema({ timestamps: true })
export class Blogs {
  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  image: string;

  @Prop()
  content: string;

  @Prop()
  author: string;

  @Prop({ default: false })
  isHide: boolean;
}

export const BlogsSchema = SchemaFactory.createForClass(Blogs);
