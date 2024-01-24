import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { UserTypes } from 'src/shared/schema/users';
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([UserTypes])
  type: string;
  @IsString()
  @IsOptional()
  secretToken?: string;
}
