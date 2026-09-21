import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ComputerComponentsService } from './computer-components.service';
import { ComputerComponent } from './entities/computer-component.entity';
import { CreateComputerComponentInput } from './dto/create-computer-component.input';
import { UpdateComputerComponentInput } from './dto/update-computer-component.input';

@Resolver(() => ComputerComponent)
export class ComputerComponentsResolver {
  constructor(
    private readonly computerComponentsService: ComputerComponentsService,
  ) {}

  @Query(() => [ComputerComponent])
  async components(): Promise<ComputerComponent[]> {
    return this.computerComponentsService.findAll();
  }

  @Query(() => [ComputerComponent])
  async componentsByCategory(
    @Args('category', { type: () => String }) category: string,
  ): Promise<ComputerComponent[]> {
    return this.computerComponentsService.findByCategory(category);
  }

  @Query(() => ComputerComponent)
  async component(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ComputerComponent> {
    return this.computerComponentsService.findOne(id);
  }

  @Mutation(() => ComputerComponent)
  async createComponent(
    @Args('input') input: CreateComputerComponentInput,
  ): Promise<ComputerComponent> {
    return this.computerComponentsService.create(input);
  }

  @Mutation(() => ComputerComponent)
  async updateComponent(
    @Args('input') input: UpdateComputerComponentInput,
  ): Promise<ComputerComponent> {
    return this.computerComponentsService.update(input);
  }

  @Mutation(() => Boolean)
  async removeComponent(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.computerComponentsService.remove(id);
  }
}