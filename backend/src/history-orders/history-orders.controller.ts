import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { HistoryOrdersService } from './history-orders.service';

@Controller()
export class HistoryOrdersController {
  constructor(private readonly historyOrdersService: HistoryOrdersService) {}

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any): Promise<void> {

    const payload = typeof data === 'string' ? JSON.parse(data) : data;

    await this.historyOrdersService.create(payload.userId, {
      orderId: payload.orderId,
      pcName: payload.pcName,
      address: payload.address,
    });
  }
}