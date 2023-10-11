import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import * as express from 'express';
import passport from 'passport';
import { INestApplicationContext } from '@nestjs/common';

export class CustomWsAdapter extends IoAdapter {
  private sessionProps: express.RequestHandler;

  constructor(
    private sessionMiddleware: express.RequestHandler,
    app: INestApplicationContext,
  ) {
    super(app);
    this.sessionProps = sessionMiddleware;
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, options);

    const wrap = (middleware) => (socket, next) => {
      middleware(socket.request, {}, next);
    };

    server.use(wrap(this.sessionProps));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));

    return server;
  }
}
