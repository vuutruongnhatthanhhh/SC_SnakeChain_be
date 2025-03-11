import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImagesDocument = HydratedDocument<Images>;

@Schema({ timestamps: true })
export class Images {
  @Prop()
  name: string;

  @Prop()
  category: string;
}

export const ImagesSchema = SchemaFactory.createForClass(Images);
