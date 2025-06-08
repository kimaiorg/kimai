import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  protected readonly config: AxiosRequestConfig;
  protected readonly httpService: AxiosHttpService = new AxiosHttpService();
  private baseURL: string;

  constructor(
    baseUrl: string,
    protected readonly logger: Logger,
  ) {
    this.baseURL = baseUrl;
    this.config = {
      baseURL: this.baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
  }

  async get<T>(endpoint: string, configs?: AxiosRequestConfig): Promise<T> {
    const mergeConfig = { ...this.config, ...configs };
    const response: AxiosResponse<T> = await lastValueFrom(
      this.httpService.get(endpoint, mergeConfig),
    );
    return response.data;
  }

  async post<T>(
    endpoint: string,
    data?: object,
    configs?: AxiosRequestConfig,
  ): Promise<T> {
    const mergeConfig = { ...this.config, ...configs };
    const response: AxiosResponse<T> = await lastValueFrom(
      this.httpService.post(endpoint, data, mergeConfig),
    );
    return response.data;
  }

  async put<T>(
    endpoint: string,
    data?: object,
    configs?: AxiosRequestConfig,
  ): Promise<T> {
    const mergeConfig = { ...this.config, ...configs };
    const response: AxiosResponse<T> = await lastValueFrom(
      this.httpService.put(endpoint, data, mergeConfig),
    );
    return response.data;
  }

  async delete<T>(endpoint: string, configs?: AxiosRequestConfig): Promise<T> {
    const mergeConfig = { ...this.config, ...configs };
    const response: AxiosResponse<T> = await lastValueFrom(
      this.httpService.delete(endpoint, mergeConfig),
    );
    return response.data;
  }
}
