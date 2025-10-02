import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Obtenemos los permisos requeridos de metadata
        const requiredPermissions = this.reflector.get<string[]>(
            'permissions',
            context.getHandler(),
        );

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true; // si no hay permisos requeridos, dejamos pasar
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user?.permisos) return false;

        const hasPermission = requiredPermissions.every((perm) =>
            user.permisos.includes(perm),
        );

        if (!hasPermission) {
            throw new ForbiddenException(
                'No tienes permisos para acceder a este recurso',
            );
        }

        return true;
    }
}
