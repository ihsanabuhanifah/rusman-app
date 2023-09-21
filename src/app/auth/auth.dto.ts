import { PartialType, PickType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  nama: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  refresh_token: string;

  @IsString()
  @IsNotEmpty()
  secret_key: string;

  @IsString()
  role: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  new_password: string;
}

export class RegisterDto extends PickType(UserDto, [
  'nama',
  'email',
  'password',
  'secret_key',
]) {}

export class LoginDto extends PickType(UserDto, ['email', 'password']) {}
