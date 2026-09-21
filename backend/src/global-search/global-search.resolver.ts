import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearch } from './entities/global-search.entity';
import { CreateGlobalSearchInput } from './dto/create-global-search.input';

@Resolver(() => GlobalSearch)
export class GlobalSearchResolver {
  constructor(private readonly globalSearchService: GlobalSearchService) {}

  @Query(() => [GlobalSearch])
  async searchPc(@Args('query', { type: () => String }) query: string,): Promise<GlobalSearch[]> {
    return this.globalSearchService.searchByName(query);
  }

  @Query(() => [GlobalSearch])
  async allSearchItems(): Promise<GlobalSearch[]> {
    return this.globalSearchService.findAll();
  }

  @Mutation(() => GlobalSearch)
  async createSearchItem(@Args('input') input: CreateGlobalSearchInput,): Promise<GlobalSearch> {
    return this.globalSearchService.create(input);
  }
}