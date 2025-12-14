import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  const config = app.get(ConfigService);
  const port = Number(config.get<string>('PORT') ?? 3000);

  await app.listen(port);
}
bootstrap();
