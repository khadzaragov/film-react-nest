import { Test, TestingModule } from '@nestjs/testing';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  const orderServiceMock = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    controller = module.get(OrderController);
    orderService = module.get(OrderService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service with dto and return list response', async () => {
      const dto = { some: 'data' };
      const items = [{ orderId: 'o1' }];

      jest.spyOn(orderService, 'createOrder').mockResolvedValue(items as any);

      const result = await controller.create(dto as any);

      expect(orderService.createOrder).toHaveBeenCalledTimes(1);
      expect(orderService.createOrder).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        total: 1,
        items,
      });
    });
  });
});
