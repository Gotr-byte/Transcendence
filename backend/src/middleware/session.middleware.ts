import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';

export const sessionMiddleware = session({
  secret: process.env.SESSIONS_SECRET + '1896',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 4320000 },
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

module.exports = { sessionMiddleware };
