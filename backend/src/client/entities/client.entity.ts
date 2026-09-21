import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity('clients')
export class Client {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ nullable: true })
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ nullable: true })
  phone: string;

  @Field()
  @Column({ nullable: true })
  address: string;

  @Field()
  @Column({ nullable: true })
  password?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
