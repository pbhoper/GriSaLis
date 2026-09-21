import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientInput): Promise<Client> {
    const existing = await this.clientRepository.findOne({
      where: { email: createClientDto.email },
    });
    if (existing) {
      throw new ConflictException('Клиент с таким email уже существует');
    }

    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Клиент с ID #${id} не найден`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientInput): Promise<Client> {
    const client = await this.findOne(id);

    if (updateClientDto.email && updateClientDto.email !== client.email) {
      const existing = await this.clientRepository.findOne({
        where: { email: updateClientDto.email, id: Not(id) },
      });
      if (existing) {
        throw new ConflictException('Клиент с таким email уже существует');
      }
    }

    const dtoData = { ...updateClientDto };
    if (dtoData.username) {
      dtoData.name = dtoData.username;
      delete dtoData.username;
    }

    Object.assign(client, dtoData);
    return this.clientRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }
}
