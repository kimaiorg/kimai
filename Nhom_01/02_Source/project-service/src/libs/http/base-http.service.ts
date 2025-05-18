/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, mergeMap, Observable } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from '../configs/env';

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

  async get<T>(
    endpoint: string,
    params?: object,
    configs?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const mergeConfig = { ...this.config, ...configs };
      const response: AxiosResponse<T> = await lastValueFrom(
        this.httpService.get(endpoint, {
          params: params,
          baseURL: this.config.baseURL,
          headers: {
            'X-Internal-Code': ENV.internal_code,
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`put ${endpoint} failed: ${error.message}`);
      throw error;
    }
  }

  async put<T>(
    endpoint: string,
    params?: object,
    configs?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const mergeConfig = { ...this.config, ...configs };
      const response: AxiosResponse<T> = await lastValueFrom(
        this.httpService.put(endpoint, params, {
          baseURL: this.config.baseURL,
          headers: {
            'X-Internal-Code': ENV.internal_code,
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`put ${endpoint} failed: ${error.message}`);
      throw error;
    }
  }
}
