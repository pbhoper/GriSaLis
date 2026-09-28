import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { HistoryOrdersService } from '../history-orders/history-orders.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly historyOrdersService: HistoryOrdersService,
  ) {}

  async createOrder(dto: CreateOrderInput): Promise<Order> {
    const newOrder = this.orderRepository.create({
      userId: dto.userId,
      clientName: dto.clientName,
      address: dto.address,
      components: dto.components,
      pcName: dto.pcName,
      price: dto.price,
      status: 'open',
    });

    const savedOrder = await this.orderRepository.save(newOrder);

    await this.historyOrdersService.create(savedOrder.userId, {
      orderId: savedOrder.id,
      pcName: savedOrder.pcName,
      address: savedOrder.address,
    });

    return savedOrder;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async confirmOrder(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Заказ не найден');

    order.status = 'confirmed';
    return await this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Заказ не найден');

    order.status = 'cancelled';
    return await this.orderRepository.save(order);
  }
}