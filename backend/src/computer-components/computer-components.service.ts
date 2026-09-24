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
    const components = await this.componentRepository.find();

    if (components.length === 0) {
      const initialPcs: CreateComputerComponentInput[] = [
        {
          name: 'CyberPower Gaming Alpha',
          category: 'Игровые ПК',
          price: 85000,
          description: 'Отличный выбор для Full HD гейминга. Процессор Core i5 + RTX 3060.',
        },
        {
          name: 'Pro Workstation',
          category: 'Рабочие станции',
          price: 145000,
          description: 'Мощный ПК для 3D-моделирования и монтажа видео. Ryzen 7 + RTX 4070.',
        },
        {
          name: 'Gamer Elite Extreme',
          category: 'Флагманские ПК',
          price: 260000,
          description: 'Бескомпромиссная мощность для 4K гейминга. Core i9 + RTX 4080 Super.',
        },
        {
          name: 'Office Pro Compact',
          category: 'Офисные ПК',
          price: 35000,
          description: 'Компактный и тихий ПК для офисных задач и работы с документами.',
        },
      ];

      const createdPcs = this.componentRepository.create(initialPcs);
      return this.componentRepository.save(createdPcs);
    }

    return components;
  }

  async findByCategory(category: string): Promise<ComputerComponent[]> {
    return this.componentRepository.find({
      where: { category },
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