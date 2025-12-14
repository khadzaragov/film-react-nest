import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument } from '../films/schemas/film.schema';
import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';

@Injectable()
export class MongoFilmsRepository extends FilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel
      .find({}, { _id: 0, __v: 0, schedule: 0 })
      .lean()
      .exec();

    return films as FilmDto[];
  }

  async findByIdWithSchedule(id: string): Promise<FilmScheduleDto | null> {
    const film = await this.filmModel
      .findOne({ id }, { _id: 0, 'schedule._id': 0 })
      .lean()
      .exec();

    return film as FilmScheduleDto | null;
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const result = await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $addToSet: { 'schedule.$.taken': seatKey } },
      )
      .exec();

    return result.modifiedCount > 0;
  }
}
