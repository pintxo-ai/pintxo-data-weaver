import { Controller, Get } from '@nestjs/common';
import { SubstreamsService } from './substreams.service.js';

@Controller('substreams')
export class SubstreamsController {
  constructor(private readonly substreamsService: SubstreamsService) {}

  // manual trigger
  @Get('/trigger')
  triggerProcessing() {
    return { message: 'Processing started' };
  }
}