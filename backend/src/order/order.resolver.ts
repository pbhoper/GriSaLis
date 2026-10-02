import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { Order } from './entities/order.entity';
import { GqlAuthGuard } from '../auth/jwt/gql-auth.guard';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async createOrder(@Args('input') dto: CreateOrderInput): Promise<Order> {
    return await this.orderService.createOrder(dto);
  }

  @Query(() => [Order])
  @UseGuards(GqlAuthGuard)
  async getUserOrders(@Args('userId', { type: () => Int }) userId: number): Promise<Order[]> {
    return await this.orderService.getUserOrders(userId);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async confirmOrder(@Args('id', { type: () => Int }) id: number): Promise<Order> {
    return await this.orderService.confirmOrder(id);
  }

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async cancelOrder(@Args('id', { type: () => Int }) id: number): Promise<Order> {
    return await this.orderService.cancelOrder(id);
  }
}