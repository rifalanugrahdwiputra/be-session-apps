/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HttpExceptionFilter,
  error_400,
  error_401,
  error_403,
  error_500,
} from '../statics/filters/exceptions.filter';
import { AuthGuard } from '../middlewares/guard/auth.guard';
import { Request } from 'express';
import { DashboardService } from 'src/domain/services/dashboard.service';

@Controller('dashboard')
@ApiTags('dashboard')
@ApiResponse({
  status: 500,
  schema: { type: 'object', properties: error_500 },
})
@ApiResponse({
  status: 401,
  schema: { type: 'object', properties: error_401 },
})
@ApiResponse({
  status: 403,
  schema: { type: 'object', properties: error_403 },
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  async findAll(@Req() request: Request) {
    try {
      return await this.dashboardService.all();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
