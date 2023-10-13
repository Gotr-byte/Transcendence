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
import { CustomError } from 'src/shared/shared.errors';

@Catch(
  CustomError,
  HttpException,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | CustomError
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
    } else if (exception instanceof CustomError) {
      if (exception.type === 'UNKNOWN_CHANNEL_ERROR') {
        response.status(HttpStatus.BAD_REQUEST).json({
          message: exception.message,
          error: 'Bad Request Error',
          statusCode: 400,
        });
      } else if (exception.type === 'RESTRICTED_USER') {
        response.status(HttpStatus.UNAUTHORIZED).json({
          message: exception.message,
          error: 'Unauthorized Error',
          statusCode: 401,
        });
      }
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }
}
