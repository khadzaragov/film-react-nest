import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @Column()
  director: string;

  @Column('float')
  rating: number;

  @Column('text', { array: true })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @OneToMany(() => ScheduleEntity, (s) => s.film)
  schedule: ScheduleEntity[];
}
