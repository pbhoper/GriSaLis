import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssemblyPcService } from './assembly-pc.service';
import { Assembly } from './entities/assembly-pc.entity';
import { CreateAssemblyPcInput } from './dto/create-assembly-pc.input';
import { GqlAuthGuard } from '../auth/jwt/gql-auth.guard';
import { Auth } from '../auth/entities/auth.entity';
import {CurrentUser} from "../auth/decorator/current-user.decorator";

@Resolver(() => Assembly)
export class AssemblyPcResolver {
  constructor(private readonly assemblyPcService: AssemblyPcService) {}

  @Mutation(() => Assembly)
  @UseGuards(GqlAuthGuard)
  async createAssembly(@CurrentUser() user: Auth, @Args('input') input: CreateAssemblyPcInput,): Promise<Assembly> {
    return this.assemblyPcService.create(user.id, input);
  }

  @Query(() => [Assembly])
  @UseGuards(GqlAuthGuard)
  async myAssemblies(@CurrentUser() user: Auth): Promise<Assembly[]> {
    return this.assemblyPcService.findMyAssemblies(user.id);
  }

  @Query(() => Assembly)
  async assembly(@Args('id', { type: () => Int }) id: number,): Promise<Assembly> {
    return this.assemblyPcService.findOne(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeAssembly(@CurrentUser() user: Auth, @Args('id', { type: () => Int }) id: number,): Promise<boolean> {
    return this.assemblyPcService.remove(id, user.id);
  }
}