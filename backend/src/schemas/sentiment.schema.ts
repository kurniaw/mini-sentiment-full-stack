import { Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose'

export type SentimentDocument = Sentiment & Document

@Schema({ timestamps: true })
export class Sentiment {

}