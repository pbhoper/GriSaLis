import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class LoginAuthInput {

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}
