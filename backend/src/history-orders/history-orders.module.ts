import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryOrdersService } from './history-orders.service';
import { HistoryOrdersResolver } from './history-orders.resolver';
import { HistoryOrder } from './entities/history-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryOrder])],
  providers: [HistoryOrdersService, HistoryOrdersResolver],
  exports: [HistoryOrdersService],
})
export class HistoryOrdersModule {}