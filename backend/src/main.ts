import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

type LoggerType = 'dev' | 'json' | 'tskv';

function getLoggerType(): LoggerType {
  const raw = (process.env.LOG_FORMAT ?? '').toLowerCase();

  if (raw === 'json' || raw === 'tskv' || raw === 'dev') {
    return raw;
  }

  const nodeEnv = (process.env.NODE_ENV ?? '').toLowerCase();
  return nodeEnv === 'production' ? 'json' : 'dev';
}

function createLogger(type: LoggerType) {
  if (type === 'tskv') return new TskvLogger();
  if (type === 'json') return new JsonLogger();
  return new DevLogger();
}

async function bootstrap() {
  const logger = createLogger(getLoggerType());

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger,
  });

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  app.useLogger(logger);
  app.flushLogs();

  const config = app.get(ConfigService);
  const port = Number(config.get<string>('PORT') ?? 3000);

  await app.listen(port);
}

bootstrap();
