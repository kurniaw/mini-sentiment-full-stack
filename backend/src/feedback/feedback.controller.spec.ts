import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackCreateDto } from './dto/feedback.dto';

const mockSummary = { total: 1, average: 5, recentComments: ['Great!'] };
const mockDocument = { _id: '1', rating: 5, comment: '' } as any;

const mockFeedbackService = {
  create: jest.fn().mockResolvedValue(mockDocument),
  getSummary: jest.fn().mockResolvedValue(mockSummary),
  resetAll: jest.fn().mockResolvedValue(undefined),
};

describe('FeedbackController', () => {
  let controller: FeedbackController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [{ provide: FeedbackService, useValue: mockFeedbackService }],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
  });

  describe('create (POST /feedback)', () => {
    it('should call feedbackService.create and return success message', async () => {
      const dto: FeedbackCreateDto = { rating: 5, comment: 'Great!' };
      const result = await controller.create(dto);

      expect(mockFeedbackService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'Feedback submitted.' });
    });
  });

  describe('getSummary (GET /feedback/summary)', () => {
    it('should call feedbackService.getSummary and return the summary', async () => {
      const result = await controller.getSummary();

      expect(mockFeedbackService.getSummary).toHaveBeenCalled();
      expect(result).toEqual(mockSummary);
    });
  });

  describe('resetAll (DELETE /feedback)', () => {
    it('should call feedbackService.resetAll and return void', async () => {
      const result = await controller.resetAll();

      expect(mockFeedbackService.resetAll).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
