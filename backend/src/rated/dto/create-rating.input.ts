import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

@InputType()
export class CreateRatingInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  comment?: string;
}