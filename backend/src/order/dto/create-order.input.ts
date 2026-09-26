import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Field, InputType, Float } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field({ nullable: true })
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
  components: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  pcName: string;

  @Field(() => Float)
  @IsNumber()
  price: number;
}