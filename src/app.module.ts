import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './httpExceptionFilter';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.development.local', '.env.development'],
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUrl'),
      }),
    }),
    UsersModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
