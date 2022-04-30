import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import StandardError from '../utils/error.utils';
import { checkHash } from './../utils/hash.utils';
import { LoginResponse, RegisterResponse, ValidateResponse } from './auth.pb';
import {
  LoginRequestDto,
  RegisterRequestDto,
  ValidateRequestDto,
} from './dto/auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  constructor(private jwtService: JwtService) {}

  public async create({
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    await this.alreadyExists('email', email);

    const user = await this.repository.create({
      email,
      password,
    });

    await this.repository.save(user);

    return { status: HttpStatus.CREATED, error: null };
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const user: User = await this.repository.findOne({ where: { email } });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['E-mail not found'],
        token: null,
      };
    }

    if (!(await checkHash(password, user.password))) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['Your credentials are invalid'],
        token: null,
      };
    }

    return {
      token: this.jwtService.sign({
        id: user.id,
        username: user.email,
        //role: userValidated.role ? userValidated.role.permissions : '',
      }),
      status: HttpStatus.OK,
      error: null,
    };
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    const user: User = await this.jwtService.verify(token);

    if (!user) {
      return {
        status: HttpStatus.FORBIDDEN,
        error: ['Token is invalid'],
        userId: null,
      };
    }

    const auth: User = await this.repository.findOne({
      where: { id: user.id },
    });

    if (!auth) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['User not found'],
        userId: null,
      };
    }

    return { status: HttpStatus.OK, error: null, userId: user.id };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.repository.findOne({
      where: { email: email },
    });

    if (!user) throw new Error('User not found');
    // if (!user.emailConfirmed)
    //  throw new StandardError(401, 'Email not confirmed');

    if (user && (await checkHash(password, user.password))) {
      delete user.password;

      return user;
    }

    return null;
  }

  private async alreadyExists(
    key: string,
    value: string,
    id?: number,
  ): Promise<void> {
    const alreadyExists = await this.repository.findOne({
      where: { [key]: value },
    });

    if (alreadyExists && alreadyExists.id !== id) {
      throw new StandardError(409, `${key} already exists`);
    }
  }
}
