import { IsEmail, IsNotEmpty, IsString, } from 'class-validator';
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class CreateClientInput {

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Телефон обязателен' })
  phone: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
