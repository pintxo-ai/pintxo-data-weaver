import { Test, TestingModule } from '@nestjs/testing';
import { PythController } from './pyth.controller';
import { PythService } from './pyth.service';

describe('PythController', () => {
  let pythController: PythController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PythController],
      providers: [PythService],
    }).compile();

    pythController = app.get<PythController>(PythController);
  });

  describe('root', () => {
    it('should return "You found pyth ;D"', () => {
      expect(pythController.getHello()).toBe('You found pyth ;D');
    });
  });
});
