import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EmailConsumerController {
  private readonly logger = new Logger(EmailConsumerController.name);

  @EventPattern('email.send_confirmation')
  handleSendConfirmation(@Payload() data: any) {
    const payload = typeof data === 'string' ? JSON.parse(data) : data;
    this.logger.log(`[KAFKA CONSUMER] Получено событие отправки подтверждения для: ${payload.email}`);
    this.logger.log(`[KAFKA CONSUMER] Ссылка для подтверждения: ${payload.confirmUrl}`);
  }
}