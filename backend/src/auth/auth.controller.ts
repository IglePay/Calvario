import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(
            body.email,
            body.password,
        );
        return this.authService.login(user);
    }

    @Post('register')
    async register(
        @Body() body: { name: string; email: string; password: string },
    ) {
        const existing = await this.authService.findByEmail(body.email);
        if (existing) throw new BadRequestException('El usuario ya existe');

        return this.authService.register(body.name, body.email, body.password);
    }
}
