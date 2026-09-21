import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateAssemblyPcInput } from './create-assembly-pc.input';

@InputType()
export class UpdateAssemblyPcInput extends PartialType(CreateAssemblyPcInput) {
  @Field(() => Int)
  id!: number;
}