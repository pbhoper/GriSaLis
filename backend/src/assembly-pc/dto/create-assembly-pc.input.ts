import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateAssemblyPcInput {
  @Field()
  @IsString({ message: 'Имя ПК должно быть строкой' })
  @IsNotEmpty({ message: 'Имя ПК обязательно' })
  name!: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'Цена должна быть числом' })
  totalPrice!: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => [Int])
  @IsArray({ message: 'Комплектующие должны быть массивом ID' })
  @IsNumber({}, { each: true })
  componentIds!: number[];
}