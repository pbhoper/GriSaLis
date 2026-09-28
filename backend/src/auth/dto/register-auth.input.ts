import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterAuthInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @Field()
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;
}