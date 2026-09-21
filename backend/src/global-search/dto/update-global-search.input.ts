import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateGlobalSearchInput } from './create-global-search.input';

@InputType()
export class UpdateGlobalSearchInput extends PartialType(CreateGlobalSearchInput) {
  @Field(() => Int)
  id!: number;
}