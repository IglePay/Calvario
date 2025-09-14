import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    // Middleware para parsear cookies
    app.use(cookieParser());

    const allowedOrigins = ['http://localhost:3000', 'https://iglepay.com'];

    const corsOptions: CorsOptions = {
        origin: (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void,
        ) =>
            !origin || allowedOrigins.includes(origin)
                ? callback(null, true)
                : callback(new Error('Not allowed by CORS')),
        credentials: true,
    };

    app.enableCors(corsOptions);

    // Pipes globales (valida DTOs)
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    // Filtro global de errores
    app.useGlobalFilters(new HttpExceptionFilter());

    //  Interceptor global de logs
    app.useGlobalInterceptors(new LoggingInterceptor());

    await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
