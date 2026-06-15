import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';

const verifyCallback =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[]
  ) =>
  async (err: unknown, user: User | false, info: unknown) => {
    console.log('ERR:', err);
    console.log('INFO:', info);
    console.log('USER:', user);
    console.log('REQUIRED RIGHTS:', requiredRights);

    if (err || info || !user) {
      console.log('AUTH FAILED HERE');
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;

    console.log('AUTH PASSED');

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) ?? [];

      console.log('USER RIGHTS:', userRights);

      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );

      console.log('HAS RIGHTS:', hasRequiredRights);

      if (!hasRequiredRights && Number(req.params.userId) !== user.id) {
        console.log('FORBIDDEN HERE');
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

export default auth;
