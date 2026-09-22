import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { AssemblyPcService } from './assembly-pc.service';
import { AssemblyPcResolver } from './assembly-pc.resolver';
import { Assembly} from './entities/assembly-pc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assembly]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  providers: [AssemblyPcService, AssemblyPcResolver],
  exports: [AssemblyPcService],
})
export class AssemblyPcModule {}