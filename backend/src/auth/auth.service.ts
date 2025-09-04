import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Usuario no encontrado');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

        return user;
    }

    async login(user: any) {
        const payload = {
            sub: user.idUsuario,
            tenant: user.idTenant,
            role: user.idRol,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
