import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AuthTokensResponseModel {
  @Field()
  accessToken!: string;

  @Field(() => Int)
  userId!: number;
}

@ObjectType()
export class MessageResponseModel {
  @Field()
  message!: string;
}