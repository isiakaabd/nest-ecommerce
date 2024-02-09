import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformationInterceptor } from './responseInterceptor';
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    // const { httpAdapter } = app.get(HttpAdapterHost);
    // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    // console.log(JSON.stringify(new MongoExceptionFilter()));

    app.useGlobalInterceptors(new TransformationInterceptor());
    const port = configService.get<number>('PORT');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.listen(port);

    console.log(`Service listening on port ${port}`);
  } catch (error: unknown) {
    console.error(
      error instanceof Error ? error.message : 'Unknown error occurred',
    );
  }
}

bootstrap();
