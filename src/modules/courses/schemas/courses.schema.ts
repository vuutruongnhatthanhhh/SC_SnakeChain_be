import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CoursesDocument = HydratedDocument<Courses>;

@Schema({ timestamps: true })
export class Courses {
  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  image: string;

  @Prop()
  shortDescription: string;

  @Prop()
  category: string;

  @Prop({ default: false })
  isHide: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lessons' }] })
  lessons: Types.ObjectId[];
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
