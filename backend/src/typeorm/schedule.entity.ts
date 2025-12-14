import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  taken: string[];

  @Column()
  filmId: string;

  @ManyToOne(() => FilmEntity, (f) => f.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity;
}
