import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './http-error.filter';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { CustomLogger } from './custom.logger';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    MorganMiddleware.configure(':method :url :status :res[content-length] -', {
      stream: { write: str => CustomLogger.log(str, MorganMiddleware.name) },
    });
    consumer
      .apply(MorganMiddleware)
      .forRoutes('*');
  }
}
