import { Injectable, Res } from '@nestjs/common';
import { LoginDto, VerifyEmailDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { EmailService } from 'src/utility/mail-handler';
import { JwtService } from '@nestjs/jwt';

import { Response } from 'express';
import {
  comparePassword,
  convertPassword,
  generateToken,
  getOTP,
} from './entities/auth.entity';
// import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly userDB: UserRepository,
    private readonly emailService: EmailService,
    private readonly jwt: JwtService,
  ) {}
  async login(
    { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.userDB.findOne({ email });
      if (!user) throw new Error(`User not found`);
      const checkPassword = await comparePassword(password, user.password);
      if (!checkPassword) throw new Error(`Incorrect Email/Password`);
      const token = await generateToken(this.jwt, user);
      response.cookie('token', token, { httpOnly: true });

      return {
        success: true,
        message: 'Login successful',
        result: {
          user: {
            name: user.name,
            email: user.email,
            type: user.type,
            id: user._id.toString(),
          },
        },
      };
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }
  async register({ email, name, password, type, secretToken }: RegisterDto) {
    try {
      if (type === 'admin' && secretToken !== this.config.get('ADMIN_TOKEN')) {
        throw new Error('Invalid secret token');
      }
      const user = await this.userDB.findOne({
        email,
      });
      if (user) throw new Error('User Already exists');
      const otp = getOTP();
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);
      const hash = await convertPassword(password);
      const newUser = await this.userDB.create({
        email,
        password: hash,
        type,
        name,
        otp,
        otpExpiryTime,
      });
      if (newUser.type === 'user') console.log(user, 'userr');
      this.emailService.sendEmail(
        newUser.email,
        'verification',
        'Email Verification',
        { customerName: newUser.name, customerEmail: newUser.email, otp },
      );
      newUser.otp = otp;
      newUser.otpExpiryTime = otpExpiryTime;

      delete newUser.password;
      return {
        success: true,
        message: newUser.type !== 'user' ? 'Admin Created' : 'User Created',
        result: newUser,
      };
    } catch (err) {
      console.log(err);
      throw Error(err);
    }
  }
  async verifyEmail({ email, token }: VerifyEmailDto) {
    try {
      const user = await this.userDB.findOne({ email });

      if (!user) throw new Error(`User not found`);
      if (user.otp !== token) throw new Error(`Invalid OTP token`);
      if (user.otpExpiryTime < new Date())
        throw new Error(` OTP expire, Pls retry`);
      user.isVerified = true;

      await this.userDB.updateOne(
        {
          email,
        },
        { isVerified: true },
      );
      return {
        success: true,
        message: 'Email Verify Successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
