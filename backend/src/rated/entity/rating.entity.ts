import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity('ratings')
export class Rating {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  clientId!: string;

  @Field()
  @Column()
  companyId!: string;

  @Field(() => Int)
  @Column()
  rating!: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}