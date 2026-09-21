import { Resolver, Query, Mutation, Args, } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import {GqlAuthGuard} from "../auth/jwt/gql-auth.guard";

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly clientService: ClientService) {}

  @Query(() => [Client])
  @UseGuards(GqlAuthGuard)
  async clients(): Promise<Client[]> {
    return this.clientService.findAll();
  }

  @Mutation(() => Client)
  @UseGuards(GqlAuthGuard)
  async createClient(@Args('input') input: CreateClientInput): Promise<Client> {
    return this.clientService.create(input);
  }
}