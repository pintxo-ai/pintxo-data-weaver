import { Controller, Get } from '@nestjs/common';
import { PythService } from './pyth.service';

/// PURPOSE - Defines a basic controller for the Pyth module, handling HTTP requests.

@Controller()
export class PythController {
  constructor(private readonly pythService: PythService) {}

  @Get()
  getHello(): string {
    return 'You found pyth ;D';
  }
}