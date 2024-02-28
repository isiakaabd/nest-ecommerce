import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  message: string;
  success: boolean;
  result: any;
  timeStamp: Date;
  error?: null;
  statusCode: number;
}

export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;

    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        success: data.success,
        result: data.result,
        timeStamp: new Date(),
        statusCode,
        path,
        error: null,
      })),
    );
  }
}
