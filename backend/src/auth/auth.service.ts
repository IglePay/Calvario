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
        // Extraer los permisos del rol
        const permisos =
            user.role?.rolePermissions?.map((rp) => rp.permiso.nombre) || [];

        const payload = {
            sub: user.id,
            tenantId: user.tenantId,
            roleId: user.roleId,
            permisos, // agregamos permisos
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '8h', // era 15 minutos
        });

        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
            },
        );

        return { access_token: accessToken, refresh_token: refreshToken };
    }

    async register(
        name: string,
        email: string,
        password: string,
        tenantId: number,
        roleId: number,
    ) {
        const hashed = await bcrypt.hash(password, 12);
        return this.usersService.createUser({
            name,
            email,
            password: hashed,
            tenantId,
            roleId,
        });
    }

    async findByEmail(email: string) {
        return this.usersService.findByEmail(email);
    }

    async findById(id: number) {
        return this.usersService.findByIdWithRelations(id);
    }
}
