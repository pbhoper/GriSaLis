import { Resolver, Mutation, Args, } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterAuthInput } from './dto/register-auth.input';
import { LoginAuthInput } from './dto/login-auth.input';
import {AuthTokensResponseModel, MessageResponseModel} from "./auth-response.model";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => MessageResponseModel)
  async register(@Args('input') input: RegisterAuthInput): Promise<MessageResponseModel> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthTokensResponseModel)
  async login(@Args('input') input: LoginAuthInput): Promise<AuthTokensResponseModel> {
    return this.authService.login(input);
  }

  @Mutation(() => MessageResponseModel)
  async confirmEmail(@Args('token') token: string): Promise<MessageResponseModel> {
    return this.authService.confirmEmail(token);
  }
}