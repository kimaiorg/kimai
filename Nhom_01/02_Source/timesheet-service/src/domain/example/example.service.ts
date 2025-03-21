import { Injectable } from '@nestjs/common';
import { ExampleRepository } from '@/infrastructure/example/example.repository';
import { Example } from '@prisma/client';

@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async getExample(): Promise<Example | null> {
    return await this.exampleRepository.findById(1);
  }
}
