import { Controller, Get } from '@nestjs/common';
import { ExampleService } from '@/domain/example/example.service';
import { Example } from '@prisma/client';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}
  @Get('')
  async get(): Promise<Example | null> {
    return await this.exampleService.getExample();
  }
}
