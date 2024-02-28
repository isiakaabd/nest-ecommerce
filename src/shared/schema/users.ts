import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export enum UserTypes {
  Admin = 'admin',
  User = 'user',
}
@Schema({
  timestamps: true,
})
export class Users extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true, min: 6 })
  password: string;
  @Prop({ required: true, enum: UserTypes })
  type: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: null })
  otp: number;
  @Prop({ default: null })
  otpExpiryTime: Date;
}
export const UserSchema = SchemaFactory.createForClass(Users);
