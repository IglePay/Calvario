import {
    Controller,
    Post,
    Body,
    BadRequestException,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.authService.validateUser(
            body.email,
            body.password,
        );
        const token = await this.authService.login(user);

        // Guardamos el token en cookie segura
        res.cookie('jwt', token.access_token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // solo https en prod
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24, // 1 día
        });

        return { message: 'Login exitoso' };
    }

    @Post('register')
    async register(
        @Body() body: { name: string; email: string; password: string },
    ) {
        const existing = await this.authService.findByEmail(body.email);
        if (existing) throw new BadRequestException('El usuario ya existe');

        return this.authService.register(body.name, body.email, body.password);
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        return { message: 'Logout exitoso' };
    }
}
