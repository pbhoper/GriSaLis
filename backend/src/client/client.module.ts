import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ClientService } from './client.service';
import { ClientResolver } from './client.resolver';
import { Client } from './entities/client.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  providers: [ClientService, ClientResolver],
  exports: [ClientService],
})
export class ClientModule {}