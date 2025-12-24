import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Film, FilmSchema } from '../films/schemas/film.schema';
import { FilmsRepository } from '../repository/films.repository';
import { MongoFilmsRepository } from '../repository/mongo-films.repository';
import { PostgresFilmsRepository } from '../repository/postgres-films.repository';
import { FilmEntity } from '../typeorm/film.entity';
import { ScheduleEntity } from '../typeorm/schedule.entity';

@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const driver = process.env.DATABASE_DRIVER ?? 'mongodb';

    if (driver === 'postgres') {
      return {
        global: true,
        module: DatabaseModule,
        imports: [
          ConfigModule,
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: 'postgres',
              host: config.get<string>('DATABASE_HOST') ?? '127.0.0.1',
              port: Number(config.get<string>('DATABASE_PORT') ?? 5432),
              username: config.get<string>('DATABASE_USERNAME') ?? 'student',
              password: config.get<string>('DATABASE_PASSWORD'),
              database: config.get<string>('DATABASE_NAME') ?? 'afisha',
              entities: [FilmEntity, ScheduleEntity],
              synchronize: true,
            }),
          }),
          TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
        ],
        providers: [
          PostgresFilmsRepository,
          {
            provide: FilmsRepository,
            useExisting: PostgresFilmsRepository,
          },
        ],
        exports: [FilmsRepository],
      };
    }

    return {
      global: true,
      module: DatabaseModule,
      imports: [
        ConfigModule,
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri:
              config.get<string>('DATABASE_URL') ??
              'mongodb://127.0.0.1:27017/afisha',
          }),
        }),
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
      ],
      providers: [
        MongoFilmsRepository,
        {
          provide: FilmsRepository,
          useExisting: MongoFilmsRepository,
        },
      ],
      exports: [FilmsRepository],
    };
  }
}
