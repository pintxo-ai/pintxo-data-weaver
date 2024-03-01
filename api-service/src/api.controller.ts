import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  // test endpoint for manual triggering
  @Get('/fetch-and-publish')
  async fetchAndPublish() {
    try {
      await this.apiService.handleCron();
      return { success: true, message: 'Data fetch and publish initiated successfully.' };
    } catch (error) {
      return { success: false, message: 'Failed to fetch and publish data.', error: error.message };
    }
  }
}