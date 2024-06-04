/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HttpExceptionFilter,
  error_400,
  error_401,
  error_403,
  error_500,
} from '../statics/filters/exceptions.filter';
import { DosenDTO } from '../dtos/dosen.dto';
import { AuthGuard } from '../middlewares/guard/auth.guard';
import { DosenService } from 'src/domain/services/dosen.service';
import { CreateDosen } from 'src/infra/models/dosen.model';
import { Request } from 'express';

@Controller('dosen')
@ApiTags('dosen')
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
export class DosenController {
  constructor(private readonly dosenService: DosenService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('create')
  @HttpCode(201)
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreateDosen, @Req() request: Request): Promise<{ message: string }> {
    try {
      return await this.dosenService.create(body, request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('update/:nidn')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('nidn') nidn: string, @Body() body: CreateDosen, @Req() request: Request) {
    try {
      return await this.dosenService.update(body, nidn, request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('activated/:nidn')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async active(@Param('nidn') nidn: string, @Req() request: Request) {
    try {
      return await this.dosenService.active(nidn, request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('deactivated/:nidn')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async deactive(@Param('nidn') nidn: string, @Req() request: Request) {
    try {
      return await this.dosenService.deactive(nidn, request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiQuery({ name: 'nama', required: false })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'include_inactive', required: false, example: false })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'nama' })
  @ApiQuery({ name: 'orderBy', required: false, example: 'DESC' })
  @UseFilters(new HttpExceptionFilter())
  async findAll(@Query() query: DosenDTO, @Req() request: Request) {
    try {
      return await this.dosenService.all(query, request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('get/:nidn')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  async findOne(@Param('nidn') nidn: string, @Req() request: Request) {
    try {
      return await this.dosenService.findOne(nidn, request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete('delete/:nidn')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  async deleteByNidn(@Param('nidn') nidn: string, @Req() request: Request) {
    try {
      return await this.dosenService.deleteByNidn(nidn, request);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
