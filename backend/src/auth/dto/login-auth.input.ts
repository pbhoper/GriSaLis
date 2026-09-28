import { IsString, IsNotEmpty } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginAuthInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Введите имя пользователя или email' })
  username: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Введите пароль' })
  password: string;
}