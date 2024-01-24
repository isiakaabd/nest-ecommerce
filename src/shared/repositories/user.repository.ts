import { Model } from 'mongoose';
import { Users } from '../schema/users';

import { InjectModel } from '@nestjs/mongoose';
export class UserRepository {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}
}
