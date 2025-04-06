import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { TaskService } from '@/domain/task/task.service';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateTaskSwagger,
  UpdateTaskSwagger,
  ListTaskSwaggerDto,
} from '@/api/task/swagger';
import {
  ListTaskDto,
  listTaskSchema,
  createTaskSchema,
  CreateTaskDto,
  updateTaskSchema,
  UpdateTaskDto,
} from '@/api/task/dto';
import { PaginationResponse } from '@/libs/response/pagination';

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
  @ApiQuery({ type: ListTaskSwaggerDto, required: false })
  @Permissions(['read:tasks'])
  @UsePipes(new ZodValidationPipe(listTaskSchema))
  async listTeams(
    @Query() dto: ListTaskDto,
  ): Promise<PaginationResponse<Task>> {
    return await this.taskService.listTasks(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateTaskSwagger, required: false })
  @Permissions(['update:tasks'])
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(updateTaskSchema)) dto: UpdateTaskDto,
  ): Promise<Task | null> {
    return await this.taskService.updateTask(id, dto);
  }
}
