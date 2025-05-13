/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, mergeMap, Observable } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export abstract class BaseHttpService {
  protected readonly config: AxiosRequestConfig;
  protected readonly httpService: AxiosHttpService = new AxiosHttpService();

  constructor(protected readonly logger: Logger) {}

  async callApi<T>(
    endpoint: string,
    method: 'get' | 'post' | 'put' | 'delete',
    params?: object,
    configs?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const mergeConfig = { ...this.config, ...configs };
      const response: AxiosResponse<T> = await lastValueFrom(
        this.httpService[method](endpoint, { params: params, ...mergeConfig }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`${method} ${endpoint} failed: ${error.message}`);
      throw error;
    }
  }
}
