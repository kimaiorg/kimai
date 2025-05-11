/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions } from '@/libs/decorators';
import { matchPermissions } from '@/utils/permissions/match-permissions.util';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const internalCode = context.switchToHttp().getRequest()?.headers[
      'x-internal-code'
    ];
    if (internalCode) {
      return true;
    }

    const permissions = this.reflector.get(Permissions, context.getHandler());
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userPermissions = request?.user?.permissions;
    return matchPermissions(userPermissions, permissions);
  }
}
