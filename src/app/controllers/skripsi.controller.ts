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
import {
    HttpExceptionFilter,
    error_400,
    error_401,
    error_403,
    error_500,
} from '../statics/filters/exceptions.filter';
import { SkripsiDTO } from '../dtos/skripsi.dto';
import { AuthGuard } from 'src/app/middlewares/guard/auth.guard';
import { SkripsiService } from 'src/domain/services/skripsi.service';
import { CreateSkripsi } from 'src/infra/models/skripsi.model';

@Controller('skripsi')
@ApiTags('skripsi')
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
export class SkripsiController {
    constructor(private readonly SkripsiService: SkripsiService) { }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('create')
    @HttpCode(201)
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() body: CreateSkripsi): Promise<{ message: String }> {
        try {
            return await this.SkripsiService.create(body);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Put('update/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(@Param('id') id: Number, @Body() body: CreateSkripsi) {
        try {
            return await this.SkripsiService.update(body, id);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Put('activated/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async active(@Param('id') id: Number) {
        try {
            return await this.SkripsiService.active(id);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Put('deactivated/:id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async deactive(@Param('id') id: Number) {
        try {
            return await this.SkripsiService.deactive(id);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Get('all')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiQuery({ name: 'skripsi', required: false })
    @ApiQuery({ name: 'page', required: true, example: 1 })
    @ApiQuery({ name: 'include_inactive', required: false, example: false })
    @ApiQuery({ name: 'limit', required: true, example: 10 })
    @ApiQuery({ name: 'sortBy', required: false, example: 'nama' })
    @ApiQuery({ name: 'orderBy', required: false, example: 'DESC' })
    @UseFilters(new HttpExceptionFilter())
    async findAll(@Query() query: SkripsiDTO) {
        try {
            return await this.SkripsiService.all(query);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Get('get/:id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @UseFilters(new HttpExceptionFilter())
    async findOne(@Param('id') id: Number) {
        try {
            return await this.SkripsiService.findOne(id);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }
}