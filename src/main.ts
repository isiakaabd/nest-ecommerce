import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TransformationInterceptor } from './responseInterceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const port = configService.get<number>('PORT');
    console.log(port);
    app.useGlobalInterceptors(new TransformationInterceptor());

    await app.listen(port);

    console.log(`Service listening on port ${port}`);
  } catch (error: unknown) {
    console.error(
      error instanceof Error ? error.message : 'Unknown error occurred',
    );
  }
}

bootstrap();
