import {
  Injectable,
  Inject,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { RegisterAuthInput } from './dto/register-auth.input';
import { LoginAuthInput } from './dto/login-auth.input';
import { Auth } from './entities/auth.entity';

export interface AuthTokensResponse {
  accessToken: string;
  userId: number;
}

export interface SocialProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  provider?: string;
  providerId?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly jwtService: JwtService,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async register(input: RegisterAuthInput): Promise<{ message: string }> {
    const existingUser = await this.authRepository.findOne({ where: { email: input.email } });
    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const confirmationToken = uuidv4();

    const user = this.authRepository.create({
      ...input,
      password: hashedPassword,
      provider: 'local',
      confirmationToken,
    });

    await this.authRepository.save(user);

    this.sendConfirmationEmail(user.email, confirmationToken);

    return { message: 'Регистрация успешна. Проверьте почту для подтверждения.' };
  }

  async login(input: LoginAuthInput): Promise<AuthTokensResponse> {
    const user = await this.authRepository.findOne({ where: { email: input.email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    if (!user.isConfirmed) {
      throw new UnauthorizedException('Пожалуйста, подтвердите email или телефон');
    }

    return this.generateTokens(user.id, user.email);
  }

  async confirmEmail(token: string): Promise<{ message: string }> {
    const user = await this.authRepository.findOne({ where: { confirmationToken: token } });
    if (!user) {
      throw new BadRequestException('Неверный или устаревший токен');
    }

    user.isConfirmed = true;
    user.confirmationToken = null;
    await this.authRepository.save(user);

    return { message: 'Аккаунт успешно подтвержден!' };
  }

  async socialLogin(profile: SocialProfile): Promise<AuthTokensResponse> {
    const existingUser = await this.authRepository.findOne({ where: { email: profile.email } });

    if (existingUser) {
      return this.generateTokens(existingUser.id, existingUser.email);
    }

    const newUser = this.authRepository.create({
      email: profile.email,
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? null,
      provider: profile.provider ?? null,
      isConfirmed: true,
    });

    const savedUser = await this.authRepository.save(newUser);

    return this.generateTokens(savedUser.id, savedUser.email);
  }

  private generateTokens(userId: number, email: string): AuthTokensResponse {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
      userId,
    };
  }

  private sendConfirmationEmail(email: string, token: string): void {
    const payload = {
      email,
      confirmUrl: `http://localhost:3000/auth/confirm?token=${token}`,
    };

    this.logger.log(`[KAFKA EMIT] Публикация события email.send_confirmation для ${email}`);

    this.kafkaClient.emit('email.send_confirmation', JSON.stringify(payload));
  }
}