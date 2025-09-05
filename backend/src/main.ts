import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');

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

    await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
