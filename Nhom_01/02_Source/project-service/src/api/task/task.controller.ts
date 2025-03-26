import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { TaskService } from '@/domain/task/task.service';
import {
  createTaskSchema,
  CreateTaskDto,
} from '@/api/task/dto/create-task.dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody } from '@nestjs/swagger';
import { CreateTaskSwagger } from '@/api/task/swagger';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @Post('')
  @ApiBody({ type: CreateTaskSwagger })
  @Permissions(['create:tasks'])
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  async createTask(@Body() dto: CreateTaskDto): Promise<Task | null> {
    return await this.taskService.createTask(dto);
  }

  @Get(':id')
  @Permissions(['read:tasks'])
  async getActivity(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task | null> {
    return await this.taskService.getTask(id);
  }

  @Get('')
  @Permissions(['read:tasks'])
  async listTeams(): Promise<Task[] | null> {
    return await this.taskService.listTasks();
  }
}
