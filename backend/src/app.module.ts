import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { HistoryOrdersModule } from './history-orders/history-orders.module';
import { GlobalSearchModule } from './global-search/global-search.module';
import { ComputerComponentsModule } from './computer-components/computer-components.module';
import { AssemblyPcModule } from './assembly-pc/assembly-pc.module';
import { KafkaModule } from "./kafka/kafka.module";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {join} from "node:path";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }) => ({ req }),
    }),
    ClientModule,
    HistoryOrdersModule,
    GlobalSearchModule,
    ComputerComponentsModule,
    AssemblyPcModule,
    AssemblyPcModule,
    KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
