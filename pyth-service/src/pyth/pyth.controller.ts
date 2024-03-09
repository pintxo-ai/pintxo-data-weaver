import { Controller, Get } from '@nestjs/common';
import { PythService } from './pyth.service';

/**
 * @description The PythController serves as the entry point for HTTP requests 
 *              related to the Pyth module. It currently offers a basic  
 *              health check endpoint.
 */
@Controller()
export class PythController {
  constructor(private readonly pythService: PythService) {}

  /**
   * @description Handles GET requests to the root path ('/') of the Pyth controller.
   * @returns {string}  A simple text response indicating the Pyth service is operational.
   */
  @Get()
  getHello(): string {
    return "You found pyth ;D";
  }
}