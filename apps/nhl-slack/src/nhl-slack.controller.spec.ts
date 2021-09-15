import { Test, TestingModule } from '@nestjs/testing';
import { NhlSlackController } from './nhl-slack.controller';
import { NhlSlackService } from './nhl-slack.service';

describe('NhlSlackController', () => {
  let nhlSlackController: NhlSlackController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NhlSlackController],
      providers: [NhlSlackService],
    }).compile();

    nhlSlackController = app.get<NhlSlackController>(NhlSlackController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(nhlSlackController.getHello()).toBe('Hello World!');
    });
  });
});
