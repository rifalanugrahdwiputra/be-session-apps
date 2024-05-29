import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { Request, Response } from 'express';

const error_400: Record<string, SchemaObject | ReferenceObject> = {
  statusCode: {
    type: 'number',
    description: 'The status code of the error',
    example: 400,
  },
  message: {
    type: 'string',
    description: 'The message of the error',
    example: 'Bad request: Please check your request parameters.',
  },
};

const error_500: Record<string, SchemaObject | ReferenceObject> = {
  statusCode: {
    type: 'number',
    description: 'The status code of the error',
    example: 500,
  },
  message: {
    type: 'string',
    description: 'The message of the error',
    example: 'Internal server error',
  },
};

const error_404: Record<string, SchemaObject | ReferenceObject> = {
  statusCode: {
    type: 'number',
    description: 'The status code of the error',
    example: 404,
  },
  message: {
    type: 'string',
    description: 'The message of the error',
    example: 'Data not found',
  },
};

const error_401: Record<string, SchemaObject | ReferenceObject> = {
  statusCode: {
    type: 'number',
    description: 'The status code of the error',
    example: 401,
  },
  message: {
    type: 'string',
    description: 'The message of the error',
    example: 'Unauthorized',
  },
};

const error_403: Record<string, SchemaObject | ReferenceObject> = {
  statusCode: {
    type: 'number',
    description: 'The status code of the error',
    example: 403,
  },
  message: {
    type: 'string',
    description: 'The message of the error',
    example: 'Forbidden',
  },
};

@Catch(HttpException)
class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    switch (status) {
      case 500:
        response.status(status).json({
            statusCode: status,
            message: 'Internal server error',
            
        });
        break;
      case 404:
        response.status(status).json({
            statusCode: status,
            message: 'Data not found',
        });
        break;
      case 401:
        response.status(status).json({
            statusCode: status,
            message: 'Unauthorized',
        });
        break;
      case 403:
        response.status(status).json({
            statusCode: status,
            message: 'Forbidden',
        });
        break;
      case 409:
        response.status(status).json({
            statusCode: status,
            message: 'Data Already Exists',
        });
        break;
      default:
        response.status(status).json({
            statusCode: status,
            message: 'Internal server error',
        });
        break;
    }

    return response;
  }
}

export {
  HttpExceptionFilter,
  error_400,
  error_500,
  error_404,
  error_401,
  error_403,
};
