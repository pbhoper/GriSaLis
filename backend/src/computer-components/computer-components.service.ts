import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComputerComponent } from './entities/computer-component.entity';
import { CreateComputerComponentInput } from './dto/create-computer-component.input';
import { UpdateComputerComponentInput } from './dto/update-computer-component.input';

@Injectable()
export class ComputerComponentsService {
  constructor(
    @InjectRepository(ComputerComponent)
    private readonly componentRepository: Repository<ComputerComponent>,
  ) {}

  async create(input: CreateComputerComponentInput): Promise<ComputerComponent> {
    const newComponent = this.componentRepository.create(input);
    return this.componentRepository.save(newComponent);
  }

  async findAll(): Promise<ComputerComponent[]> {
    return this.componentRepository.find();
  }

  async findByCategory(category: string): Promise<ComputerComponent[]> {
    return this.componentRepository.find({
      where: { category, inStock: true },
    });
  }

  async findOne(id: number): Promise<ComputerComponent> {
    const component = await this.componentRepository.findOne({ where: { id } });
    if (!component) {
      throw new NotFoundException(`Комплектующее с ID ${id} не найдено`);
    }
    return component;
  }

  async update(input: UpdateComputerComponentInput): Promise<ComputerComponent> {
    const component = await this.findOne(input.id);
    const updated = this.componentRepository.merge(component, input);
    return this.componentRepository.save(updated);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.componentRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}