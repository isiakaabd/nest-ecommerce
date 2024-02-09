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
  password: string;

  //   @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(UserTypes))
  type: UserTypes;
  @IsString()
  @IsOptional()
  secretToken?: string;
}
