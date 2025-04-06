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
import { Project } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { ProjectService } from '@/domain/project/project.service';
import {
  CreateProjectDto,
  createProjectSchema,
  updateProjectSchema,
  UpdateProjectDto,
  listProjectSchema,
  ListProjectDto,
} from '@/api/project/dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ProjectEntity } from '@/libs/entities';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateProjectSwagger,
  UpdateProjectSwagger,
  ListProjectSwaggerDto,
} from '@/api/project/swagger';
import { PaginationResponse } from '@/libs/response/pagination';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Post('')
  @ApiBody({ type: CreateProjectSwagger })
  @Permissions(['create:projects'])
  @UsePipes(new ZodValidationPipe(createProjectSchema))
  async createProject(
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectEntity | null> {
    return await this.projectService.createProject(dto);
  }

  @Get(':id')
  @Permissions(['read:projects'])
  async getProject(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Project | null> {
    return await this.projectService.getProject(id);
  }

  @Get('')
  @ApiQuery({ type: ListProjectSwaggerDto, required: false })
  @Permissions(['read:projects'])
  @UsePipes(new ZodValidationPipe(listProjectSchema))
  async listProjects(
    @Query() dto: ListProjectDto,
  ): Promise<PaginationResponse<Project>> {
    return await this.projectService.listProjects(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateProjectSwagger, required: false })
  @Permissions(['update:projects'])
  @UsePipes(new ZodValidationPipe(listProjectSchema))
  async updateProjects(
    @Param('id') id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project | null> {
    return await this.projectService.updateProject(id, dto);
  }
}
