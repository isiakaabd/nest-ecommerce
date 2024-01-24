import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface Response {
  message: string;
  success: boolean;
  result: any;
  timeStamp: Date;
  statusCode: number;
}

export class TransformationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getResponse().url;

    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        success: data.success,
        result: data.result,
        timeStamp: new Date(),
        statusCode,
        path,
        error: null,
        // if (data instanceof HtttpException) {
        //   return data.getResponse();
        // }
        // return data;
      })),
    );
  }
}
