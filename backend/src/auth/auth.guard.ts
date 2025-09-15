import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies['jwt'];

        console.log('token recibido:', token);

        // Retorna una promesa que valida el token
        return this.verifyToken(token)
            .then((payload) => {
                console.log('payload decodificado:', payload);

                // Normalizamos la estructura de user
                request.user = {
                    id: payload.sub,
                    tenantId: payload.tenantId,
                    roleId: payload.roleId,
                };

                return true;
            })
            .catch(() => {
                return Promise.reject(
                    new UnauthorizedException('Token inválido o no autorizado'),
                );
            });
    }

    private verifyToken(token: string | undefined): Promise<any> {
        return new Promise((resolve, reject) => {
            token
                ? this.jwtService
                      .verifyAsync(token)
                      .then(resolve)
                      .catch(() => reject(new Error('Token inválido')))
                : reject(new Error('No autorizado'));
        });
    }
}
