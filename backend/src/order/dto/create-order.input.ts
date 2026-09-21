import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class CreateOrderInput {

  @Field()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  components: string

  @Field()
  @IsString()
  @IsNotEmpty()
  pcName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  price: number;
}
