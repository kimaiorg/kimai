import { Controller, Get } from '@nestjs/common';

@Controller('example')
export class ExampleController {
  @Get('')
  get() {
    return 'Hello, World!';
  }
}
