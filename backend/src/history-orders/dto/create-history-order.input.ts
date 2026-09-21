import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateHistoryOrderInput {
  @Field(() => Int)
  @IsNumber()
  orderId!: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  pcName!: string;
}