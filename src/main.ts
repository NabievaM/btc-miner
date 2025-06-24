import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function start() {
  try {
    const PORT = process.env.PORT || 3000;

    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('BTC Miner')
      .setDescription('Bitcoin mining system with NestJS + TypeORM')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => {
      console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Произошла ошибка при запуске сервера:', error);
  }
}
start();
