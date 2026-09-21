import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssemblyPcService } from './assembly-pc.service';
import { AssemblyPcResolver } from './assembly-pc.resolver';
import { Assembly } from './entities/assembly-pc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assembly])],
  providers: [AssemblyPcService, AssemblyPcResolver],
  exports: [AssemblyPcService],
})
export class AssemblyPcModule {}