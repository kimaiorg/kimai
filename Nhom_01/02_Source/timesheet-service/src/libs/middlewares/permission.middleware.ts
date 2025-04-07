import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const roles = ['super_admin', 'admin', 'team_lead', 'user'];

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = req['user']?.permissions;

      const role = roles.find((role) => permissions.includes(role));
      if (!role) {
        req['role'] = null;
      } else {
        req['role'] = role;
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    next();
  }
}
