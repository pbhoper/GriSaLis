import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

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

    this.kafkaClient.emit(
      'order_created',
      JSON.stringify({
        userId: savedOrder.userId,
        orderId: savedOrder.id,
        pcName: savedOrder.pcName,
        address: savedOrder.address,
        price: savedOrder.price,
      }),
    );

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
    const updatedOrder = await this.orderRepository.save(order);

    this.kafkaClient.emit(
      'order_confirmed',
      JSON.stringify({
        orderId: updatedOrder.id,
        userId: updatedOrder.userId,
        status: updatedOrder.status,
      }),
    );

    return updatedOrder;
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Заказ не найден');

    order.status = 'cancelled';
    const updatedOrder = await this.orderRepository.save(order);

    this.kafkaClient.emit(
      'order_cancelled',
      JSON.stringify({
        orderId: updatedOrder.id,
        userId: updatedOrder.userId,
        status: updatedOrder.status,
      }),
    );

    return updatedOrder;
  }
}