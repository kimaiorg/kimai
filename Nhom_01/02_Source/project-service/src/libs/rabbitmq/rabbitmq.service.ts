/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitmqService {
  constructor(private readonly client: ClientProxy) {}

  async emit(pattern: any, data: any): Promise<void> {
    try {
      await firstValueFrom(this.client.emit(pattern, data));
    } catch (error) {
      throw new Error(`RabbitMQ emit error: ${error.message}`);
    }
  }
}
