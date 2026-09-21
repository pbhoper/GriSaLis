import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateHistoryOrderInput } from './create-history-order.input';

@InputType()
export class UpdateHistoryOrderInput extends PartialType(CreateHistoryOrderInput) {
  @Field(() => Int)
  id!: number;
}