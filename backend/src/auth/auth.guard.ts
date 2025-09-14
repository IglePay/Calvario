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

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies['jwt'];

        console.log('token recibido:', token);

        if (!token) throw new UnauthorizedException('No autorizado');

        try {
            const payload = this.jwtService.verify(token);
            console.log('payload deccodificado:', payload);
            request.user = payload; // aquí setea el usuario en la request
            return true;
        } catch (err) {
            throw new UnauthorizedException('Token inválido');
        }
    }
}
