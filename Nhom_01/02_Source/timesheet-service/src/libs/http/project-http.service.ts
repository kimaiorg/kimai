import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { BaseHttpService } from './base-http.service';

@Injectable()
export class ProjectHttpService extends BaseHttpService {
  protected config: AxiosRequestConfig;

  constructor(protected readonly configService: ConfigService) {
    const logger = new Logger(ProjectHttpService.name);
    super(logger);
    this.config = {
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: configService.get<string>('PROJECT_SERVICE_URL'),
    };
  }
}
