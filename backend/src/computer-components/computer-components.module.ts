import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputerComponentsService } from './computer-components.service';
import { ComputerComponentsResolver } from './computer-components.resolver';
import { ComputerComponent } from './entities/computer-component.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComputerComponent])],
  providers: [ComputerComponentsService, ComputerComponentsResolver],
  exports: [ComputerComponentsService],
})
export class ComputerComponentsModule {}