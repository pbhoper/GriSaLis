import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity('history_orders')
export class HistoryOrder {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Int)
  @Column()
  userId!: number;

  @Field(() => Int)
  @Column()
  orderId!: number;

  @Field()
  @Column()
  pcName!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}