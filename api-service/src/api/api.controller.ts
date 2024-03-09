import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

/**
 * The ApiController provides an endpoint for manually triggering data fetching and publishing processes.
 */
@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Endpoint: '/fetch-and-publish'
   * 
   * Manually triggers the data fetching and publishing process. [NOT NEEDED]
   * 
   * @returns {Object} - Response object indicating success or failure, and optionally an error message.
   */
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