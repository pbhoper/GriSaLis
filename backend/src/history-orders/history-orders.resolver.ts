import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HistoryOrdersService } from './history-orders.service';
import { HistoryOrder } from './entities/history-order.entity';
import { GqlAuthGuard } from '../auth/jwt/gql-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@Resolver(() => HistoryOrder)
export class HistoryOrdersResolver {

  constructor(private readonly historyOrdersService: HistoryOrdersService) {}

  @Query(() => [HistoryOrder])
  @UseGuards(GqlAuthGuard)
  async myHistoryOrders(
    @CurrentUser() user: { id: number },
  ): Promise<HistoryOrder[]> {
    return this.historyOrdersService.findByUserId(user.id);
  }
}