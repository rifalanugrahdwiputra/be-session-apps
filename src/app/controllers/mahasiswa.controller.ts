/*
https://docs.nestjs.com/controllers#controllers
*/

import {
    Body,
    Controller,
    Get,
    Delete,
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
import { MahasiswaDTO } from '../dtos/mahasiswa.dto';
import { AuthGuard } from 'src/app/middlewares/guard/auth.guard';
import { MahasiswaService } from 'src/domain/services/mahasiswa.service';
import { CreateMahasiswa } from 'src/infra/models/mahasiswa.model';
import { Request } from 'express';

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
    async create(@Body() body: CreateMahasiswa, @Req() request: Request): Promise<{ message: string }> {
        try {
            return await this.MahasiswaService.create(body, request);
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
    async update(@Param('nim') nim: string, @Body() body: CreateMahasiswa, @Req() request: Request) {
        try {
            return await this.MahasiswaService.update(body, nim, request);
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
    async active(@Param('nim') nim: string, @Req() request: Request) {
        try {
            return await this.MahasiswaService.active(nim, request);
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
    async deactive(@Param('nim') nim: string, @Req() request: Request) {
        try {
            return await this.MahasiswaService.deactive(nim, request);
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
    async findAll(@Query() query: MahasiswaDTO, @Req() request: Request) {
        try {
            return await this.MahasiswaService.all(query, request);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Get('get/:nim')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @UseFilters(new HttpExceptionFilter())
    async findOne(@Param('nim') nim: string, @Req() request: Request) {
        try {
            return await this.MahasiswaService.findOne(nim, request);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Delete('delete/:nim')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @UseFilters(new HttpExceptionFilter())
    async deleteByNim(@Param('nim') nim: string) {
        try {
            return await this.MahasiswaService.deleteByNim(nim);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }
}
