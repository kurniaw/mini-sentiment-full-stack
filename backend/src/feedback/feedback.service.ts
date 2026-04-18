import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from '../schemas/feedback.schema';
import { FeedbackCreateDto, FeebackResponseDto } from './dto/feedback.dto';

interface AggregationResult {
  total: number;
  average: number | null;
  recentComments: Array<{ comment: string }>;
}

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(dto: FeedbackCreateDto): Promise<FeedbackDocument> {
    const doc = new this.feedbackModel({
      rating: dto.rating,
      comment: dto.comment ?? '',
    });
    return doc.save();
  }

  async getSummary(): Promise<FeebackResponseDto> {
    const [result] = await this.feedbackModel.aggregate<AggregationResult>([
      {
        $facet: {
          stats: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                average: { $avg: '$rating' },
              },
            },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 3 },
            { $project: { _id: 0, comment: 1 } },
          ],
        },
      },
      {
        $project: {
          total: { $ifNull: [{ $arrayElemAt: ['$stats.total', 0] }, 0] },
          average: { $ifNull: [{ $arrayElemAt: ['$stats.average', 0] }, null] },
          recentComments: '$recent',
        },
      },
    ]);

    const total = result?.total ?? 0;
    const rawAverage = result?.average ?? null;
    const average = rawAverage !== null ? Math.round(rawAverage * 10) / 10 : 0;

    const recentComments = (result?.recentComments ?? [])
      .map((r) => r.comment)
      .filter(Boolean);

    return { total, average, recentComments };
  }

  async resetAll(): Promise<void> {
    await this.feedbackModel.deleteMany({});
  }
}
