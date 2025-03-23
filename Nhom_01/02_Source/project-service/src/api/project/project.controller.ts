import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Project } from '@prisma/client';
import { Permissions } from '@/libs/decorators';
import { ProjectService } from '@/domain/project/project.service';
import {
  CreateProjectDto,
  createProjectSchema,
} from '@/api/project/dto/create-project.dto';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ProjectEntity } from '@/libs/entities';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Post('')
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
  @Permissions(['read:projects'])
  async listProjects(): Promise<Project[] | null> {
    return await this.projectService.listProjects();
  }
}
