import {
  Controller,
  Post,
  HttpCode,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  error_400,
  error_500,
  error_401,
  error_403,
  HttpExceptionFilter,
} from '../statics/filters/exceptions.filter';
import { UtilsService } from 'src/domain/services/util.service';
import { Response } from 'express';
import { AuthGuard } from '../middlewares/guard/auth.guard';
import multer from 'multer';
import * as fs from 'fs';

@Controller('util')
@ApiTags('Util')
@ApiResponse({
  status: 400,
  schema: { type: 'object', properties: error_400 },
})
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
export class UtilController {
  constructor(private readonly utilService: UtilsService) { }

  // ...

  @Post('uploadFile')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Upload created successfully' },
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
  async upload(@UploadedFile() file: multer.File) {
    try {
      const filename = await this.utilService.uploads(file);
      return {
        statusCode: 201,
        message: 'Upload created successfully',
        data: { filename },
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('viewImage/:filename')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async viewImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = `src/assets/${filename}`;
    try {
      const fileBuffer = await fs.promises.readFile(filePath);
      res.writeHead(200, {
        'Content-Type': 'image/jpeg', // atau jenis file lainnya
        'Content-Length': fileBuffer.length,
      });
      res.end(fileBuffer);
    } catch (error) {
      console.error('Error reading file:', error);
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('downloadFile/:filename')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    if (!filename) {
      throw new HttpException('Filename is empty', HttpStatus.BAD_REQUEST);
    }

    const filetrim = filename.trim()
    const filesplits = filetrim.split('.');
    const ext = filesplits.length > 0 ? filesplits[filesplits.length - 1] : 'none';

    if (!['pdf', 'doc', 'docx', 'png', 'svg', 'jpg'].includes(ext)) {
      throw new HttpException('Invalid file format, file accept with extention .pdf, .doc, .docx, png, svg, jpg', HttpStatus.BAD_REQUEST);
    }

    const isExists = this.utilService.checkExistsFile(filename);
    if (!isExists) {
      throw new HttpException('File not exists', HttpStatus.NOT_FOUND);
    }

    try {
      const fileBuffer = await this.utilService.downloadFile(filename);

      if (!fileBuffer) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileBuffer.length,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });

      res.end(fileBuffer);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
}
