import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

describe('AppController', () => {
  let apiController: ApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService],
    }).compile();

    apiController = app.get<ApiController>(ApiController);
  });

  describe('root', () => {
    it('should return "Data fetch and publish initiated successfully."', () => {
      expect(apiController.fetchAndPublish()).toBe('Data fetch and publish initiated successfully.');
    });
  });
});
