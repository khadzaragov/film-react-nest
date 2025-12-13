import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  CreateOrderTicketDto,
  OrderConfirmationDto,
} from '../order/dto/order.dto';
import { FilmDto, FilmScheduleSessionDto } from './dto/films.dto';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmDto[]> {
    return this.filmsRepository.findAll();
  }

  async getFilmSchedule(id: string): Promise<FilmScheduleSessionDto[]> {
    const film = await this.filmsRepository.findByIdWithSchedule(id);

    if (!film) {
      throw new NotFoundException(`Film with id "${id}" was not found`);
    }

    return film.schedule;
  }

  async reserveSeat(
    ticket: CreateOrderTicketDto,
  ): Promise<OrderConfirmationDto> {
    const film = await this.filmsRepository.findByIdWithSchedule(ticket.film);

    if (!film) {
      throw new NotFoundException(`Film "${ticket.film}" was not found`);
    }

    const schedule = film.schedule.find(
      (session) => session.id === ticket.session,
    );

    if (!schedule) {
      throw new NotFoundException(
        `Schedule "${ticket.session}" was not found for film "${ticket.film}"`,
      );
    }

    this.validateSeat(ticket, schedule.rows, schedule.seats);

    const seatKey = this.createSeatKey(ticket.row, ticket.seat);

    if (schedule.taken.includes(seatKey)) {
      throw new ConflictException('Seat is already taken');
    }

    const updated = await this.filmsRepository.addTakenSeat(
      ticket.film,
      ticket.session,
      seatKey,
    );

    if (!updated) {
      throw new ConflictException('Seat is already taken');
    }

    return {
      id: randomUUID(),
      film: ticket.film,
      session: ticket.session,
      row: ticket.row,
      seat: ticket.seat,
      price: schedule.price,
      daytime: schedule.daytime,
    };
  }

  private validateSeat(
    ticket: CreateOrderTicketDto,
    totalRows: number,
    totalSeats: number,
  ): void {
    if (ticket.row < 1 || ticket.row > totalRows) {
      throw new BadRequestException('Row number is out of range');
    }

    if (ticket.seat < 1 || ticket.seat > totalSeats) {
      throw new BadRequestException('Seat number is out of range');
    }
  }

  private createSeatKey(row: number, seat: number): string {
    return `${row}:${seat}`;
  }
}
