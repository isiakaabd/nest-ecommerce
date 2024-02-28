import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/utility/mail-handler';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema, Users } from 'src/shared/schema/users';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService, UserRepository],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),

        signOptions: { expiresIn: '15m' },
        global: true,
      }),
    }),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [EmailService],
})
export class AuthModule {}
