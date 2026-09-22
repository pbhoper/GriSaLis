import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { HistoryOrdersService } from './history-orders.service';
import { HistoryOrdersResolver } from './history-orders.resolver';
import { HistoryOrder } from './entities/history-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryOrder]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  providers: [HistoryOrdersService, HistoryOrdersResolver],
  exports: [HistoryOrdersService],
})
export class HistoryOrdersModule {}