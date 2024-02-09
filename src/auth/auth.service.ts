import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { EmailService } from 'src/utility/mail-handler';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly userDB: UserRepository,
    private readonly emailService: EmailService,
  ) {}
  async login({ email, password }: LoginDto) {
    try {
      const user = await this.userDB.findOne({ email });

      if (!user) throw new Error(`User not found`);
      const checkPassword = await this.comparePassword(password, user.password);
      if (!checkPassword) throw new Error(`Incorrect Email/Password`);
      const token = await this.generateToken(user);

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
          token,
        },
      };
    } catch (error) {
      throw new Error(error);
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

      const otp = this.getOTP();
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);
      const hash = await this.convertPassword(password);
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
      return {
        success: true,
        message: newUser.type !== 'user' ? 'Admin Created' : 'User Created',
        result: { email: newUser.email },
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async convertPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    const pswMatch = await bcrypt.compareSync(password, hash);

    return pswMatch;
  }
  getOTP(): number {
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp;
  }
  async generateToken(user): Promise<string> {
    const payload = {
      sub: user._id,
      email: user.email,
    };
    const acess_token = jwt.sign(payload, this.config.get('JWT_SECRET_KEY'), {
      expiresIn: '15m',
    });
    return acess_token;
  }
}
