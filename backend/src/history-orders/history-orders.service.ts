import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryOrder } from './entities/history-order.entity';
import { CreateHistoryOrderInput } from './dto/create-history-order.input';

@Injectable()
export class HistoryOrdersService {
  constructor(
    @InjectRepository(HistoryOrder)
    private readonly historyOrderRepository: Repository<HistoryOrder>,
  ) {}

  async create(userId: number, input: CreateHistoryOrderInput): Promise<HistoryOrder> {
    const historyItem = this.historyOrderRepository.create({...input, userId,});
    return this.historyOrderRepository.save(historyItem);
  }

  async findByUserId(userId: number): Promise<HistoryOrder[]> {
    return this.historyOrderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}