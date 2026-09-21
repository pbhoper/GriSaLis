import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssemblyPcService } from './assembly-pc.service';
import { Assembly } from './entities/assembly-pc.entity';
import { CreateAssemblyPcInput } from './dto/create-assembly-pc.input';
import {GqlAuthGuard} from "../auth/jwt/gql-auth.guard";

@Resolver(() => Assembly)
export class AssemblyPcResolver {
  constructor(private readonly assemblyPcService: AssemblyPcService) {}

  @Mutation(() => Assembly)
  @UseGuards(GqlAuthGuard)
  async createAssembly(
    @Context() context: any,
    @Args('input') input: CreateAssemblyPcInput,
  ): Promise<Assembly> {
    const userId = context.req.user.id;
    return this.assemblyPcService.create(userId, input);
  }

  @Query(() => [Assembly])
  @UseGuards(GqlAuthGuard)
  async myAssemblies(@Context() context: any): Promise<Assembly[]> {
    const userId = context.req.user.id;
    return this.assemblyPcService.findMyAssemblies(userId);
  }

  @Query(() => Assembly)
  async assembly(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Assembly> {
    return this.assemblyPcService.findOne(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeAssembly(
    @Context() context: any,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const userId = context.req.user.id;
    return this.assemblyPcService.remove(id, userId);
  }
}