import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  token: number;
}
