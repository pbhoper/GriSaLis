import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ComputerComponent } from './entities/computer-component.entity';
import { CreateComputerComponentInput } from './dto/create-computer-component.input';
import { UpdateComputerComponentInput } from './dto/update-computer-component.input';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ComputerComponentsService implements OnModuleInit {
  constructor(
    @InjectRepository(ComputerComponent)
    private readonly componentRepository: Repository<ComputerComponent>,
  ) {
  }

  async onModuleInit() {
    const count = await this.componentRepository.count();
    if (count === 0) {
      const initialPcs: CreateComputerComponentInput[] = [
        {
          name: 'CyberPower Gaming Alpha',
          category: 'Игровые ПК',
          price: 85000,
          description: 'Отличный выбор для Full HD гейминга. Процессор Core i5-13400F + RTX 3060 + 16GB RAM.',
        },
        {
          name: 'Pro Workstation',
          category: 'Рабочие станции',
          price: 145000,
          description: 'Мощный ПК для 3D-моделирования и монтажа видео. Ryzen 7 7800X3D + RTX 4070 + 32GB RAM.',
        },
        {
          name: 'Gamer Elite Extreme',
          category: 'Флагманские ПК',
          price: 260000,
          description: 'Бескомпромиссная мощность для 4K гейминга. Core i9-14900K + RTX 4080 Super + 64GB RAM.',
        },
        {
          name: 'Office Pro Compact',
          category: 'Офисные ПК',
          price: 35000,
          description: 'Компактный и тихий ПК для офисных задач и работы с документами.',
        },
      ];

      const createdPcs = this.componentRepository.create(initialPcs);
      await this.componentRepository.save(createdPcs);
    }
  }

  async findAll(): Promise<ComputerComponent[]> {
    return await this.componentRepository.find();
  }

  async findOne(id: string | number): Promise<ComputerComponent> {
    const component = await this.componentRepository.findOneBy({id} as any);
    if (!component) {
      throw new NotFoundException(`Компьютер с ID ${id} не найден`);
    }
    return component;
  }

  async findByCategory(category: string): Promise<ComputerComponent[]> {
    return await this.componentRepository.findBy({category} as any);
  }

  async create(input: CreateComputerComponentInput): Promise<ComputerComponent> {
    const created = this.componentRepository.create(input);
    return await this.componentRepository.save(created);
  }

  async update(input: UpdateComputerComponentInput): Promise<ComputerComponent> {
    const component = await this.findOne(input.id);
    Object.assign(component, input);
    return await this.componentRepository.save(component);
  }

  async remove(id: string | number): Promise<boolean> {
    const result = await this.componentRepository.delete(id as any);
    return (result.affected ?? 0) > 0;
  }
}