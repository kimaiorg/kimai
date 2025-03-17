/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import { envDto } from '@/dto/env.dto';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      envFilePath: '.env',
      validate: (config) => {
        return new envDto(config as any);
      },
    }),
  ],
})
export class ConfigModule {}
