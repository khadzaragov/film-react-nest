import { Controller, Get, Param } from '@nestjs/common';

import { ApiListResponseDto } from '../common/dto/api-list-response.dto';
import { FilmDto, FilmScheduleSessionDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<ApiListResponseDto<FilmDto>> {
    const items = await this.filmsService.getFilms();
    return {
      total: items.length,
      items,
    };
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<ApiListResponseDto<FilmScheduleSessionDto>> {
    const items = await this.filmsService.getFilmSchedule(id);
    return {
      total: items.length,
      items,
    };
  }
}
