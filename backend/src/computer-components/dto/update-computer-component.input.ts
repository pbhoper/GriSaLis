import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateComputerComponentInput } from './create-computer-component.input';

@InputType()
export class UpdateComputerComponentInput extends PartialType(CreateComputerComponentInput) {
  @Field(() => Int)
  id!: number;
}