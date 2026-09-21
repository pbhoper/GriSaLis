import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSearchService } from './global-search.service';
import { GlobalSearchResolver } from './global-search.resolver';
import { GlobalSearch } from './entities/global-search.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSearch])],
  providers: [GlobalSearchService, GlobalSearchResolver],
  exports: [GlobalSearchService],
})
export class GlobalSearchModule {}