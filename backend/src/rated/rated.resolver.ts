import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CreateRatingInput } from './dto/create-rating.input';
import {GqlAuthGuard} from "../auth/jwt/gql-auth.guard";
import {Rating} from "./entity/rating.entity";
import {RatingService} from "./rated.service";

@Resolver(() => Rating)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Mutation(() => Rating)
  @UseGuards(GqlAuthGuard)
  async createRating(@Args('input') input: CreateRatingInput,): Promise<Rating> {
    return this.ratingService.createRating(input);
  }
}