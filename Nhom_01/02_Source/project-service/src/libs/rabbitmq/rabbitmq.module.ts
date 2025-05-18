/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { ENV } from '@/libs/configs/env';
import { RabbitmqService } from '@/libs/rabbitmq/rabbitmq.service';

export interface RabbitmqConfig {
  queue: string;
  url?: string;
}

export interface RabbitMQModuleOptions {
  name: string;
  config: RabbitmqConfig;
}

@Module({})
export class RabbitmqModule {
  static register(config: RabbitmqConfig): DynamicModule {
    const url = ENV.rabbitmq.url;
    const queueName = config.queue;
    const clientProviderToken = `RABBITMQ_CLIENT_${queueName.toUpperCase()}`;
    const serviceProviderToken = `RABBITMQ_SERVICE_${queueName.toUpperCase()}`;

    if (!url) {
      throw new Error('RabbitMQ URL is required but not provided');
    }

    return {
      module: RabbitmqModule,
      imports: [
        ClientsModule.register([
          {
            name: clientProviderToken,
            transport: Transport.RMQ,
            options: {
              urls: [url],
              queue: queueName,
              queueOptions: { durable: true },
            },
          },
        ]),
      ],
      providers: [
        {
          provide: serviceProviderToken,
          useFactory: (client: ClientProxy) => new RabbitmqService(client),
          inject: [clientProviderToken],
        },
      ],
      exports: [serviceProviderToken],
    };
  }
}
