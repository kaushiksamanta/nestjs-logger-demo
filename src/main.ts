import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLogger } from './custom.logger';

async function bootstrap() {
  CustomLogger.setGlobalPrefix('App Service');
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  await app.listen(3000);
}
bootstrap();
