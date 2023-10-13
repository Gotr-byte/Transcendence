import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { Socket } from 'socket.io';
import { CustomError } from 'src/shared/shared.errors';

@Catch(
  CustomError,
  WsException,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
)
export class WsExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | CustomError
      | WsException
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const wsContext = host.switchToWs();
    const client = wsContext.getClient<Socket>();

    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        client.emit('error', 'This Entry already exsits in Database');
      }
      if (exception.code === 'P2025') {
        console.log(exception);
        client.emit('error', 'Entity was not found in Database');
      } else {
        console.error('Prisma Error:', exception);
        client.emit('error', 'Database Error');
      }
    } else if (exception instanceof PrismaClientUnknownRequestError) {
      console.error('Unknown Prisma Error:', exception);
      client.emit('error', 'Unknown Database Error');
    } else if (exception instanceof WsException) {
      const errorData = exception.getError();

      if (errorData) {
        client.emit('error', errorData);

        if ((errorData as any)?.type === 'AUTH_EXCEPTION') {
          client.disconnect();
        }
      } else {
        client.emit('error', 'An unknown error occurred');
      }
    } else if (exception instanceof CustomError) {
      client.emit('error', { msg: exception.message, type: exception.type });
    }
  }
}
