import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/libs/pipes/zod-validation.pipe';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { RequestService } from '@/domain/request/request.service';
import {
  CreateRequestDto,
  createRequestSchema,
  ListRequestDto,
  listRequestSchema,
  updateRequestSchema,
  UpdateRequestDto,
} from './dto';
import {
  CreateRequestSwagger,
  ListRequestSwaggerDto,
  UpdateRequestSwagger,
} from './swagger';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}
  @Post('')
  @ApiBody({ type: CreateRequestSwagger })
  async createRequest(
    @Body(new ZodValidationPipe(createRequestSchema)) dto: CreateRequestDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as { sub: string };
    return await this.requestService.createRequest(dto, user.sub);
  }

  @Get(':id')
  async getRequest(@Param('id', ParseIntPipe) id: number) {
    return await this.requestService.getRequest(id);
  }

  @Get('')
  @ApiQuery({ type: ListRequestSwaggerDto, required: false })
  @UsePipes(new ZodValidationPipe(listRequestSchema))
  async listRequests(@Query() dto: ListRequestDto) {
    return await this.requestService.listRequests(dto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateRequestSwagger, required: false })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateRequestSchema)) dto: UpdateRequestDto,
  ) {
    return await this.requestService.updateRequest(id, dto);
  }
}
