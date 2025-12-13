import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ApiListResponseDto } from '../common/dto/api-list-response.dto';
import { CreateOrderDto, OrderConfirmationDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateOrderDto,
  ): Promise<ApiListResponseDto<OrderConfirmationDto>> {
    const items = await this.orderService.createOrder(dto);
    return {
      total: items.length,
      items,
    };
  }
}
