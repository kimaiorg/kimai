import { All, Controller, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('proxy')
@Controller('proxy')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*')
  get(@Req() req: Request) {
    return this.appService.proxyRequest(req);
  }
}
