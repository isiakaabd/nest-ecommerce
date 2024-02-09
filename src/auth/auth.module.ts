import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/utility/mail-handler';
// import { UserRepository } from 'src/shared/repositories/user.repository';
import { UserSchema, Users } from 'src/shared/schema/users';
import { UserRepository } from 'src/shared/repositories/user.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, EmailService, UserRepository],
  imports: [
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
