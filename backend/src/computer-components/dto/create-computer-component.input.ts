import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateComputerComponentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  category!: string;

  @Field(() => Float)
  @IsNumber()
  price!: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}