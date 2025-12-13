import { BadRequestException, Injectable } from '@nestjs/common';

import { FilmsService } from '../films/films.service';
import { CreateOrderDto, OrderConfirmationDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderConfirmationDto[]> {
    if (!dto.tickets?.length) {
      throw new BadRequestException('No tickets provided');
    }

    const results: OrderConfirmationDto[] = [];
    for (const ticket of dto.tickets) {
      results.push(await this.filmsService.reserveSeat(ticket));
    }

    return results;
  }
}
