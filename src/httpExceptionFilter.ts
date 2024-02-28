import { Catch, HttpException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces';

@Catch(HttpException)
export class AllExceptionsFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    console.log(exception, 'ddd');
    const exceptionResponse = exception.response.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exceptionResponse,
    });
  }
}
