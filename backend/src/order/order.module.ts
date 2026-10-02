import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import {Order} from "./entities/order.entity";
import {AuthModule} from "../auth/auth.module";
import {HistoryOrdersModule} from "../history-orders/history-orders.module";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    AuthModule,
    HistoryOrdersModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
        },
      },
    ])
  ],
  controllers: [],
  providers: [OrderService,OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
