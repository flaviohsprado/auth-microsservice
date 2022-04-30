import { Exclude } from 'class-transformer';
import { IsEmail, IsMobilePhone } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptionalStringColumn } from './../../commons/decorators/column/isOptionalStringColumn.decorator';
import { IsRequiredStringColumn } from './../../commons/decorators/column/isRequiredStringColumn.decorator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @IsRequiredStringColumn()
  public username: string;

  @IsRequiredStringColumn()
  @Exclude()
  public password: string;

  @IsOptionalStringColumn()
  @IsEmail()
  public email?: string;

  @IsOptionalStringColumn()
  public name?: string;

  @Column({ nullable: true, type: 'date' })
  @Exclude()
  public dateOfBirth?: string;

  @IsOptionalStringColumn()
  @IsMobilePhone('pt-BR')
  public phoneNumber?: string;

  @IsOptionalStringColumn()
  @Exclude()
  public address?: string;

  @IsOptionalStringColumn()
  @Exclude()
  public neighborhood?: string;

  @IsOptionalStringColumn()
  @Exclude()
  public city?: string;

  @IsOptionalStringColumn()
  @Exclude()
  public country?: string;

  @CreateDateColumn({
    nullable: true,
  })
  public createdAt?: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  public updatedAt?: Date;

  @Column({ nullable: true, default: false })
  public emailConfirmed?: boolean;

  @IsOptionalStringColumn()
  public accessToken?: string;

  /*@OneToOne(() => File, (file) => file.ownerId, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public file?: File;

  @ManyToOne(() => Role, (Role) => Role.id)
  @JoinColumn({ name: 'roleId' })
  public role?: Role;

  @IsOptionalStringColumn()
  public roleId?: string;*/
}
