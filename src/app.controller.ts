import { Controller, Get, UsePipes, Post, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { UpperCasePipe } from './app.pipes';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name, true);

  constructor(private readonly appService: AppService) {
    this.logger.verbose('!!!!!!!!!!!!!!! AppController initialiZed !!!!!!!!!!!!!!!!!');
  }

  @Get()
  getHello(): Record<string, string> {
    this.logger.warn(JSON.stringify({
      hello: this.appService.getHello(),
    }));
    return {
      hello: this.appService.getHello(),
    };
  }

  @Get('/error')
  getError(): string {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Post()
  @UsePipes(new UpperCasePipe())
  setHello(@Body() body: string[]): Record<string, string[]> {
    return {
      data: body,
    };
  }
}
