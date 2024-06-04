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
import { AuthGuard } from 'src/app/middlewares/guard/auth.guard';
import { ProgramStudiService } from 'src/domain/services/program_studi.service';
import { CreateProgramStudi } from 'src/infra/models/program_studi.model';
import { ProgramStudiDTO } from '../dtos/program_studi.dto';

@Controller('program_studi')
@ApiTags('program_studi')
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
export class ProgramStudiController {
  constructor(private readonly programStudiService: ProgramStudiService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('create')
  @HttpCode(201)
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreateProgramStudi): Promise<{ message: string }> {
    try {
      return await this.programStudiService.create(body);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('update/:kode')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('kode') kode: string, @Body() body: CreateProgramStudi) {
    try {
      return await this.programStudiService.update(body, kode);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('activated/:kode')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async active(@Param('kode') kode: string) {
    try {
      return await this.programStudiService.active(kode);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('deactivated/:kode')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @UsePipes(new ValidationPipe({ transform: true }))
  async deactive(@Param('kode') kode: string) {
    try {
      return await this.programStudiService.deactive(kode);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('all')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiQuery({ name: 'program_studi', required: false })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'include_inactive', required: false, example: false })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'program_studi' })
  @ApiQuery({ name: 'orderBy', required: false, example: 'DESC' })
  @UseFilters(new HttpExceptionFilter())
  async findAll(@Query() query: ProgramStudiDTO) {
    try {
      return await this.programStudiService.all(query);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('get/:kode')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  async findOne(@Param('kode') kode: string) {
    try {
      return await this.programStudiService.findOne(kode);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete('delete/:kode')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  async deleteByKode(@Param('kode') kode: string) {
    try {
      return await this.programStudiService.deleteByKode(kode);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
