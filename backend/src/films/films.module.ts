import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  imports: [DatabaseModule.forRoot()],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
