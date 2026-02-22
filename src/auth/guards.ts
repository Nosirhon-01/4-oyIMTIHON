import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      throw new ForbiddenException('Only admins can access this resource');
    }

    return true;
  }
}

@Injectable()
export class SuperadminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'SUPERADMIN') {
      throw new ForbiddenException('Only superadmins can access this resource');
    }

    return true;
  }
}

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new ForbiddenException('Authentication required');
    }

    return true;
  }
}
