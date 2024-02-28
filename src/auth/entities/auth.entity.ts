import * as bcrypt from 'bcryptjs';
import { Users } from 'src/shared/schema/users';
// import { JwtService } from '@nestjs/jwt';

const convertPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};
const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const pswMatch = await bcrypt.compareSync(password, hash);

  return pswMatch;
};
const getOTP = (): number => {
  const otp = Math.floor(Math.random() * 900000) + 100000;
  return otp;
};
const generateToken = async (jwt, user: Users): Promise<string> => {
  // const payload = { sub: user.userId, username: user.username };
  const payload = {
    sub: user._id,
    email: user.email,
  };
  const acess_token = await jwt.signAsync(payload);

  return acess_token;
};
export { convertPassword, generateToken, getOTP, comparePassword };
