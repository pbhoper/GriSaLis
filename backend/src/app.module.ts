import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { HistoryOrdersModule } from './history-orders/history-orders.module';
import { GlobalSearchModule } from './global-search/global-search.module';
import { ComputerComponentsModule } from './computer-components/computer-components.module';
import { AssemblyPcModule } from './assembly-pc/assembly-pc.module';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5433,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'poiuytrewq123.com',
      database: process.env.DB_NAME || 'pc_shop',
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    ClientModule,
    HistoryOrdersModule,
    GlobalSearchModule,
    ComputerComponentsModule,
    AssemblyPcModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}