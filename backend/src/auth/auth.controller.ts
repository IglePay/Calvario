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
import { JwtPayload } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    isProd = process.env.NODE_ENV === 'production';

    @UseGuards(AuthGuard)
    @Get('me')
    async getMe(@Req() req: Request) {
        const userPayload = req.user as JwtPayload;

        const user = await this.authService.findById(userPayload.id);
        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return {
            name: user.name,
            email: user.email,
            tenant: user.tb_tenants?.nombre,
            role: user.role?.nombre,
            tenantId: user.tenantId,
            permisos:
                user.role?.rolePermissions?.map((rp) => rp.permiso.nombre) ||
                [],
        };
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

        // Verificar tenant por ID en vez de nombre (más seguro)
        if (body.iglesia && user.tenantId !== Number(body.iglesia)) {
            throw new UnauthorizedException('No autorizado para este tenant');
        }

        const tokens = await this.authService.login(user);

        const isProd = process.env.NODE_ENV === 'production';

        // Set cookie con access token
        res.cookie(
            process.env.COOKIE_ACCESS_NAME || 'jwt',
            tokens.access_token,
            {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? 'strict' : 'lax',
                maxAge:
                    Number(process.env.COOKIE_MAX_AGE_ACCESS) ||
                    1000 * 60 * 60 * 8, //  formato 1000 *60*15 15m
                domain: process.env.COOKIE_DOMAIN || undefined,
            },
        );

        // Set cookie con refresh token
        if (tokens.refresh_token) {
            res.cookie(
                process.env.COOKIE_REFRESH_NAME || 'refresh_jwt',
                tokens.refresh_token,
                {
                    httpOnly: true,
                    secure: isProd,
                    sameSite: isProd ? 'strict' : 'lax',
                    maxAge:
                        Number(process.env.COOKIE_MAX_AGE_REFRESH) ||
                        1000 * 60 * 60 * 24 * 30, // 30d
                    domain: process.env.COOKIE_DOMAIN || undefined,
                },
            );
        }

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

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie(process.env.COOKIE_ACCESS_NAME || 'jwt');
        res.clearCookie(process.env.COOKIE_REFRESH_NAME || 'refresh_jwt');
        return { message: 'Logout exitoso' };
    }
}
