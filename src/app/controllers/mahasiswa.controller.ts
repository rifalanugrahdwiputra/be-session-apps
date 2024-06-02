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
import { MahasiswaDTO } from '../dtos/mahasiswa.dto';
import { AuthGuard } from '../middlewares/guard/auth.guard';
import { MahasiswaService } from 'src/domain/services/mahasiswa.service';
import { CreateMahasiswa } from 'src/infra/models/mahasiswa.model';

@Controller('mahasiswa')
@ApiTags('mahasiswa')
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
export class MahasiswaController {
    constructor(private readonly MahasiswaService: MahasiswaService) { }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('create')
    @HttpCode(201)
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() body: CreateMahasiswa): Promise<{ message: string }> {
        try {
            return await this.MahasiswaService.create(body);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Put('update/:nim')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async update(@Param('nim') nim: string, @Body() body: CreateMahasiswa) {
        try {
            return await this.MahasiswaService.update(body, nim);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Put('activated/:nim')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async active(@Param('nim') nim: string) {
        try {
            return await this.MahasiswaService.active(nim);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Put('deactivated/:nim')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async deactive(@Param('nim') nim: string) {
        try {
            return await this.MahasiswaService.deactive(nim);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Get('all')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ApiQuery({ name: 'mahasiswa', required: false })
    @ApiQuery({ name: 'page', required: true, example: 1 })
    @ApiQuery({ name: 'include_inactive', required: false, example: false })
    @ApiQuery({ name: 'limit', required: true, example: 10 })
    @ApiQuery({ name: 'sortBy', required: false, example: 'nama' })
    @ApiQuery({ name: 'orderBy', required: false, example: 'DESC' })
    @UseFilters(new HttpExceptionFilter())
    async findAll(@Query() query: MahasiswaDTO) {
        try {
            return await this.MahasiswaService.all(query);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Get('get/:nim')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @UseFilters(new HttpExceptionFilter())
    async findOne(@Param('nim') nim: string) {
        try {
            return await this.MahasiswaService.findOne(nim);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }
}
