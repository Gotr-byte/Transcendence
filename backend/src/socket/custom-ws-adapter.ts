import { ForbiddenException } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { Server, ServerOptions } from 'socket.io';
import * as express from 'express';
import passport from 'passport';

export class CustomWsAdapter extends IoAdapter {
  private sessionMiddleware: express.RequestHandler;

  constructor(
    sessionMiddleware: express.RequestHandler,
    app: INestApplicationContext,
  ) {
    super(app);
    this.sessionMiddleware = sessionMiddleware;
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, options);

    server.on('error', (error) => {
      console.log('SocketIO Error Handler');
      throw new ForbiddenException('SocketIO Error Handler');
    });

    const wrap = (middleware) => (socket, next) =>
      middleware(socket.request, {}, next);

    server.use(wrap(this.sessionMiddleware));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));

    return server;
  }
}
