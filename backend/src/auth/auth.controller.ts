import {
    Body,
    Controller,
    Post,
    Get,
    Req,
    Res,
    UnauthorizedException,
    BadRequestException,
    UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard)
    @Get('me')
    getMe(@Req() req: Request) {
        return req.user;
    }

    @Post('login')
    async login(
        @Body() body: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.authService.validateUser(
            body.email,
            body.password,
        );

        // Verificamos que el usuario pertenece al tenant (iglesia)
        if (body.iglesia && user.tb_tenants.nombre !== body.iglesia) {
            throw new UnauthorizedException('No autorizado para esta iglesia');
        }

        const token = await this.authService.login(user);

        res.cookie('jwt', token.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24,
        });

        return { message: 'Login exitoso' };
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        const existing = await this.authService.findByEmail(body.email);
        if (existing) throw new BadRequestException('El usuario ya existe');

        return this.authService.register(
            body.name,
            body.email,
            body.password,
            body.tenantId ?? 1,
            body.roleId ?? 2,
        );
    }
}
