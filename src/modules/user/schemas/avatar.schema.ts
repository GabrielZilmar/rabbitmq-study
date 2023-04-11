import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop()
  content: Buffer;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
