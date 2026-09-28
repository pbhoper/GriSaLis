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
    const existingUser = await this.authRepository.findOne({
      where: [{ email: input.email }, { username: input.username }],
    });

    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email или логином уже существует');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const confirmationToken = uuidv4();

    const user = this.authRepository.create({
      ...input,
      firstName: input.firstName ?? input.username ?? 'Пользователь',
      password: hashedPassword,
      provider: 'local',
      isConfirmed: true,
      confirmationToken,
    });

    await this.authRepository.save(user);

    try {
      this.sendConfirmationEmail(user.email, confirmationToken);
    } catch (e) {
      this.logger.warn('Не удалось отправить подтверждение через Kafka:', e);
    }

    return { message: 'Регистрация прошла успешно! Теперь вы можете войти.' };
  }

  async login(input: LoginAuthInput): Promise<AuthTokensResponse> {

    const user = await this.authRepository.findOne({
      where: [{ email: input.username }, { username: input.username }],
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
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