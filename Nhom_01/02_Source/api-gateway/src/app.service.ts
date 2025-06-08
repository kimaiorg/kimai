import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from './libs/http/base-http.service';
import { Request } from 'express';
import { ENV } from './libs/configs/env';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private timesheetService: HttpService;
  private projectService: HttpService;
  private NotificationService: HttpService;
  private readonly configService: ConfigService = new ConfigService(ENV);

  constructor() {
    this.timesheetService = new HttpService(
      this.configService.get<string>('TIMESHEET_SERVICE_URL') || '',
      this.logger,
    );
    this.projectService = new HttpService(
      this.configService.get<string>('PROJECT_SERVICE_URL') || '',
      this.logger,
    );
    this.NotificationService = new HttpService(
      this.configService.get<string>('NOTIFICATION_SERVICE_URL') || '',
      this.logger,
    );
  }

  async proxyRequest(req: Request): Promise<any> {
    const endpoint = req.url.replace('proxy/', '');
    const method = req.method.toLowerCase();

    const serviceName = req.headers['x-service-name'] as string;
    if (!serviceName) {
      throw new BadRequestException('Service name is required in headers');
    }

    const service = this.getService(serviceName);
    const token = req.headers['authorization'] as string;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    this.logger.log(
      `Proxying request to ${serviceName} service at ${endpoint} with method ${method}`,
    );
    try {
      switch (method) {
        case 'get':
          return service.get(endpoint, config);
        case 'post':
          return service.post(endpoint, req.body as object, config);
        case 'put':
          return service.put(endpoint, req.body as object, config);
        case 'delete':
          return service.delete(endpoint, config);
        default:
          throw new BadRequestException(`Unsupported method: ${method}`);
      }
    } catch (error) {
      this.logger.error(`Error in proxyRequest: ${(error as Error).message}`);
      throw new BadRequestException(
        `Error processing request: ${(error as Error).message}`,
      );
    }
  }

  private getService(serviceName: string): HttpService {
    switch (serviceName) {
      case 'timesheet':
        return this.timesheetService;
      case 'project':
        return this.projectService;
      case 'notification':
        return this.NotificationService;
      default:
        throw new BadRequestException(`Unknown service: ${serviceName}`);
    }
  }
}
