import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(0, 100)
  username: string;
  @IsString()
  @Length(0, 100)
  password: string;
}
