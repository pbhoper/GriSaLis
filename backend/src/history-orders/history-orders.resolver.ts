import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HistoryOrdersService } from './history-orders.service';
import { HistoryOrder } from './entities/history-order.entity';
import { CreateHistoryOrderInput } from './dto/create-history-order.input';
import {GqlAuthGuard} from "../auth/jwt/gql-auth.guard";
import {CurrentUser} from "../auth/decorator/current-user.decorator";

@Resolver(() => HistoryOrder)
export class HistoryOrdersResolver {
  constructor(private readonly historyOrdersService: HistoryOrdersService) {}

  @Query(() => [HistoryOrder])
  @UseGuards(GqlAuthGuard)
  async myHistoryOrders(@CurrentUser() user: { id: number },): Promise<HistoryOrder[]> {
    return this.historyOrdersService.findByUserId(user.id);
  }

  @Mutation(() => HistoryOrder)
  @UseGuards(GqlAuthGuard)
  async createHistoryOrder(@CurrentUser() user: { id: number }, @Args('input') input: CreateHistoryOrderInput,): Promise<HistoryOrder> {
    return this.historyOrdersService.create(user.id, input);
  }
}