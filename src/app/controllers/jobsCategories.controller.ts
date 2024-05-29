/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
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
import { JobsCategoriesService } from 'src/domain/services/jobsCategories.service';
import { CreateCategory } from 'src/infra/models/jobCategories.model';
import {
  HttpExceptionFilter,
  error_400,
  error_401,
  error_403,
  error_500,
} from '../statics/filters/exceptions.filter';
import { JobCategoryDTO } from '../dtos/categories.dto';
import { AuthGuard } from '../middlewares/guard/auth.guard';

@Controller('categories')
@ApiTags('Categories')
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
export class Jobs_categoriesController {
  constructor(private readonly jobs_categoriesService: JobsCategoriesService) { }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @Post('create')
  @HttpCode(201)
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category created successfully' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Data Already Exists' },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() body: CreateCategory): Promise<{ message: string }> {
    try {
      return await this.jobs_categoriesService.create(body);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('update/:id')
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category updated successfully' },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: number, @Body() body: CreateCategory) {
    try {
      return await this.jobs_categoriesService.update(body, id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('activated/:id')
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category activated successfully' },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async active(@Param('id') id: number) {
    try {
      return await this.jobs_categoriesService.active(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('deactivated/:id')
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Category deactivated successfully',
        },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async deactive(@Param('id') id: number) {
    try {
      return await this.jobs_categoriesService.deactive(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('all')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @HttpCode(200)
  @ApiQuery({ name: 'category_name', required: false })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'include_inactive', required: false, example: false })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'category' })
  @ApiQuery({ name: 'orderBy', required: false, example: 'ASC | DESC' })
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'list',
          example: [
            {
              id: 4,
              category: 'QA Automation',
              is_active: false,
              created_at: '2024-02-17T12:11:57.943Z',
            },
          ],
        },
        count: { type: 'number', example: 1 },
      },
    },
  })
  async findAll(@Query() query: JobCategoryDTO) {
    try {
      return await this.jobs_categoriesService.all(query);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('get/:id')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @HttpCode(200)
  @UseFilters(new HttpExceptionFilter())
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 200,
        },
        data: {
          type: 'object',
          example: {
            id: 2,
            category: 'Backend Developers',
            is_active: true,
            created_at: '2024-02-17T11:05:55.281Z',
          },
        },
      },
    },
  })
  async findOne(@Param('id') id: number) {
    try {
      return await this.jobs_categoriesService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
