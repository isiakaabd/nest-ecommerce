import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    console.log(loginDto);
    return 'This action adds a new auth';
  }
  async register(registerDto: RegisterDto) {
    console.log(registerDto);
    return 'This action adds a new auth';
  }
}
