import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LessonsDocument = HydratedDocument<Lessons>;

@Schema({ timestamps: true })
export class Lessons {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  videoUrl: string;

  @Prop()
  price: Number;

  @Prop({ default: false })
  isHide: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Courses' })
  course: Types.ObjectId;
}

export const LessonsSchema = SchemaFactory.createForClass(Lessons);
