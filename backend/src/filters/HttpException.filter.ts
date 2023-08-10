import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

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
        response.status(HttpStatus.FORBIDDEN).json({
          message: 'This entity already exists',
          error: 'Forbidden',
          statusCode: 404,
        });
      }
      if (exception.code === 'P2025') {
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'User was not found',
          error: 'Bad Request',
          statusCode: 400,
        });
      }
    } else {
      response.status(exception.getStatus()).json(exception.getResponse());
    }
  }
}
