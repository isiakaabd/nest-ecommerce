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

  @IsNotEmpty()
  @IsIn(Object.values(UserTypes))
  @IsOptional({ each: true }) // Make the property optional
  type: UserTypes = UserTypes.User;

  secretToken?: string;
}
