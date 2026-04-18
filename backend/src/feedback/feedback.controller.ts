import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackCreateDto, FeebackResponseDto } from './dto/feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: FeedbackCreateDto): Promise<{ message: string }> {
    await this.feedbackService.create(dto);
    return { message: 'Feedback submitted.' };
  }

  @Get('summary')
  async getSummary(): Promise<FeebackResponseDto> {
    return this.feedbackService.getSummary();
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetAll(): Promise<void> {
    await this.feedbackService.resetAll();
  }
}
