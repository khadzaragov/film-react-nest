import { Test, TestingModule } from '@nestjs/testing';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: FilmsService;

  const filmsServiceMock = {
    getFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsServiceMock,
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
    filmsService = module.get(FilmsService);

    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('should return list response with total and items from service', async () => {
      const items = [{ id: '1' }, { id: '2' }];

      jest.spyOn(filmsService, 'getFilms').mockResolvedValue(items as any);

      const result = await controller.getFilms();

      expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        total: 2,
        items,
      });
    });
  });

  describe('getFilmSchedule', () => {
    it('should call service with film id and return list response', async () => {
      const items = [{ id: 's1' }];

      jest
        .spyOn(filmsService, 'getFilmSchedule')
        .mockResolvedValue(items as any);

      const result = await controller.getFilmSchedule('film-123');

      expect(filmsService.getFilmSchedule).toHaveBeenCalledTimes(1);
      expect(filmsService.getFilmSchedule).toHaveBeenCalledWith('film-123');
      expect(result).toEqual({
        total: 1,
        items,
      });
    });
  });
});
