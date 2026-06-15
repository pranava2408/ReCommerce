import prisma from '../client';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import config from './config';
import { TokenType } from '@prisma/client';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    // ── 1. Verify token type is ACCESS (not REFRESH) ──────────────────────────
    if (payload.type !== TokenType.ACCESS) {
      console.warn(
        `[passport] Wrong token type — got "${payload.type}", expected "${TokenType.ACCESS}"`
      );
      return done(null, false);
    }

    // ── 2. Coerce sub to the correct type for Prisma ─────────────────────────
    // JWT always serialises sub as a string. If your User.id is Int in Prisma
    // schema, Number() it; if it's a UUID String, leave it as-is.
    const rawSub = payload.sub;
    const userId: number | string =
      typeof rawSub === 'string' && !isNaN(Number(rawSub))
        ? Number(rawSub)   // numeric id  →  Int
        : rawSub;          // UUID string →  String

    // ── 3. Look up the user ───────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      select: { id: true, email: true, name: true, role: true },
      where:  { id: userId as any },
    });

    if (!user) {
      console.warn(`[passport] No user found for id: ${userId}`);
      return done(null, false);
    }

    return done(null, user);

  } catch (error) {
    console.error('[passport] jwtVerify error:', error);
    return done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);