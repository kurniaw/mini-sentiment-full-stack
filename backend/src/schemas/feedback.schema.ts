import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ required: true, min: 1, max: 5 })
  rating!: number;

  @Prop({ default: '', maxlength: 500 })
  comment!: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
