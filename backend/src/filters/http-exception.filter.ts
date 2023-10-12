import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(
  HttpException,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | HttpException
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        response.status(HttpStatus.CONFLICT).json({
          message: 'This entity already exists in Database',
          error: 'Conflict',
          statusCode: 409,
        });
      }
      if (exception.code === 'P2025') {
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Entity was not found in Database',
          error: 'Not Found',
          statusCode: 404,
        });
      }
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      console.error('Unknown Prisma Error:', exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Unknown Database Error',
        error: 'Internal Server Error',
        statusCode: 500,
      });
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }
}
