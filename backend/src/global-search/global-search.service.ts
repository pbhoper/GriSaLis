import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { GlobalSearch } from './entities/global-search.entity';
import { CreateGlobalSearchInput } from './dto/create-global-search.input';

@Injectable()
export class GlobalSearchService {
  constructor(
    @InjectRepository(GlobalSearch)
    private readonly globalSearchRepository: Repository<GlobalSearch>,
  ) {}

  async searchByName(query: string): Promise<GlobalSearch[]> {
    const names = query.trim();
    if (!names) return [];

    return this.globalSearchRepository.find({
      where: {
        name: ILike(`%${names}%`),
      },
    });
  }

  async create(input: CreateGlobalSearchInput): Promise<GlobalSearch> {
    const newItem = this.globalSearchRepository.create(input);
    return this.globalSearchRepository.save(newItem);
  }

  async findAll(): Promise<GlobalSearch[]> {
    return this.globalSearchRepository.find();
  }
}