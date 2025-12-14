import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { FilmEntity } from '../typeorm/film.entity';
import { ScheduleEntity } from '../typeorm/schedule.entity';
import { FilmsRepository } from './films.repository';

@Injectable()
export class PostgresFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmsRepo: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepo: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmsRepo.find({
      select: {
        id: true,
        title: true,
        about: true,
        description: true,
        director: true,
        rating: true,
        tags: true,
        image: true,
        cover: true,
      },
    });

    return films.map((film) => ({
      id: film.id,
      title: film.title,
      about: film.about,
      description: film.description,
      director: film.director,
      rating: film.rating,
      tags: film.tags ?? [],
      image: film.image,
      cover: film.cover,
    }));
  }

  async findByIdWithSchedule(id: string): Promise<FilmScheduleDto | null> {
    const film = await this.filmsRepo.findOne({
      where: { id },
      relations: { schedule: true },
    });

    if (!film) return null;

    return {
      id: film.id,
      title: film.title,
      about: film.about,
      description: film.description,
      director: film.director,
      rating: film.rating,
      tags: film.tags ?? [],
      image: film.image,
      cover: film.cover,
      schedule: (film.schedule ?? []).map((s) => ({
        id: s.id,
        daytime: s.daytime,
        hall: s.hall,
        rows: s.rows,
        seats: s.seats,
        price: s.price,
        taken: s.taken ?? [],
      })),
    };
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const res = await this.scheduleRepo
      .createQueryBuilder()
      .update(ScheduleEntity)
      .set({ taken: () => `array_append("taken", :seatKey)` })
      .where(`"filmId" = :filmId`, { filmId })
      .andWhere(`"id" = :sessionId`, { sessionId })
      .andWhere(`NOT ("taken" @> ARRAY[:seatKey]::text[])`)
      .setParameters({ seatKey })
      .execute();

    return (res.affected ?? 0) > 0;
  }
}
