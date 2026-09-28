import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import {Order} from "./entities/order.entity";
import {AuthModule} from "../auth/auth.module";
import {HistoryOrdersModule} from "../history-orders/history-orders.module";

@Module({
  imports: [TypeOrmModule.forFeature([Order]), AuthModule, HistoryOrdersModule,],
  controllers: [],
  providers: [OrderService,OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
