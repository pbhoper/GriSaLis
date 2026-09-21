import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity('users')
export class Auth {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', unique: true, nullable: true })
  username: string | null;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Field()
  @Column({ type: 'varchar', default: 'local', nullable: true })
  provider: string | null;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Field()
  @Column({ default: false })
  isConfirmed: boolean;

  @Field()
  @Column({ type: 'varchar', nullable: true })
  confirmationToken: string | null;
}