import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SourceCodeDocument = HydratedDocument<SourceCode>;

@Schema({ timestamps: true })
export class SourceCode {
  @Prop()
  code: string;

  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  stack: string;

  @Prop({ default: 'FRONTEND' })
  field: string;

  @Prop()
  description: string;

  @Prop()
  extendedDescription: string;

  @Prop()
  price: Number;

  @Prop()
  originalPrice: Number;

  @Prop()
  image: string;

  @Prop([String])
  extendedImage: string[];

  @Prop()
  linkDoc: string;

  @Prop()
  linkYoutube: string;

  @Prop()
  linkWebsite: string;

  @Prop({ default: false })
  isHide: boolean;
}

export const SourceCodeSchema = SchemaFactory.createForClass(SourceCode);
