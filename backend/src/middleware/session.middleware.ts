import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';

export const sessionMiddleware = session({
  secret: process.env.SESSIONS_SECRET + '1896',
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 4320000 },
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

export const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

module.exports = { sessionMiddleware, wrap };
