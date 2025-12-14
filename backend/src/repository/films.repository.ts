import { FilmDto, FilmScheduleDto } from '../films/dto/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findByIdWithSchedule(id: string): Promise<FilmScheduleDto | null>;
  abstract addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean>;
}
