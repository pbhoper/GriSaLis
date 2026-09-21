import { PartialType } from '@nestjs/mapped-types';
import { CreateClientInput } from './create-client.input';
import { IsOptional, IsString } from 'class-validator';
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {

  @Field()
  @IsOptional()
  @IsString()
  username?: string;

  @Field()
  @IsOptional()
  @IsString()
  password?: string;
}
