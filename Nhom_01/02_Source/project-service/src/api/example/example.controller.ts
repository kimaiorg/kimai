import { Controller, Get } from '@nestjs/common';
import { ExampleService } from '@/domain/example/example.service';
import { Example } from '@prisma/client';
import { Permissions } from '@/libs/decorators';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}
  @Get('')
  @Permissions(['read:example'])
  async get(): Promise<Example | null> {
    console.log('ExampleController.get');
    return await this.exampleService.getExample();
  }
}
