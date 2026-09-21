import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity('orders')
export class Order {

  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  userId: number;

  @Field()
  @Column()
  clientName: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  components: string

  @Field()
  @Column()
  pcName: string;

  @Field()
  @Column({ default: 'open' })
  status: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
