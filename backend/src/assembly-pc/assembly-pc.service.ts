import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assembly } from './entities/assembly-pc.entity';
import { CreateAssemblyPcInput } from './dto/create-assembly-pc.input';

@Injectable()
export class AssemblyPcService {
  constructor(
    @InjectRepository(Assembly)
    private readonly assemblyRepository: Repository<Assembly>,
  ) {}

  async create(userId: number, input: CreateAssemblyPcInput): Promise<Assembly> {
    const newAssembly = this.assemblyRepository.create({
      ...input,
      userId,
    });
    return this.assemblyRepository.save(newAssembly);
  }

  async findMyAssemblies(userId: number): Promise<Assembly[]> {
    return this.assemblyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Assembly> {
    const assembly = await this.assemblyRepository.findOne({ where: { id } });
    if (!assembly) {
      throw new NotFoundException(`Сборка с ID ${id} не найдена`);
    }
    return assembly;
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const assembly = await this.findOne(id);
    if (assembly.userId !== userId) {
      throw new ForbiddenException('У вас нет прав на удаление этой сборки');
    }
    await this.assemblyRepository.remove(assembly);
    return true;
  }
}