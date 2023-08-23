import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(HttpException, PrismaClientKnownRequestError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException | PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        response.status(HttpStatus.CONFLICT).json({
          message: 'This entity already exists',
          error: 'Conflict',
          statusCode: 409,
        });
      }
      if (exception.code === 'P2025') {
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Entity was not found',
          error: 'Not Found',
          statusCode: 404,
        });
      }
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }
}
