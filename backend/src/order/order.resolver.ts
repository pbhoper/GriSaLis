import {Controller, Get, Post, Patch, Param, Body, ParseIntPipe, UseGuards} from '@nestjs/common';
import { OrderService } from './order.service';
import {CreateOrderInput} from "./dto/create-order.input";
import {Order} from "./entities/order.entity";
import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {GqlAuthGuard} from "../auth/jwt/gql-auth.guard";

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  @UseGuards(GqlAuthGuard)
  async createOrder(@Args('input') dto: CreateOrderInput): Promise<Order> {
    return await this.orderService.createOrder(dto);
  }

  @Query(() => Order)
  async getUserOrders(@Args('userId', {type: () => Int}) userId: number): Promise<Order[]> {
    return await this.orderService.getUserOrders(userId);
  }

  @Query(() => Order)
  async confirmOrder(@Args('id', {type: () => Int}) id: number): Promise<Order> {
    return await this.orderService.confirmOrder(id);
  }

  @Query(() => Order)
  async cancelOrder(@Args('id',{type: () => Int}) id: number): Promise<Order> {
    return await this.orderService.cancelOrder(id);
  }
}