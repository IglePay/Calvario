import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        this.logger.error(
            `HTTP Error: ${status} - ${JSON.stringify(errorResponse)} - Path: ${request.url}`,
        );

        response.status(status).json({
            statusCode: status,
            path: request.url,
            error: errorResponse,
            timestamp: new Date().toISOString(),
        });
    }
}
