import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RandomWordsService } from './random-words/random-words.service';
import { TagsService } from './tags/tags.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { VideosController } from './videos/videos.controller';
import { VideosService } from './videos/videos.service';

@Module({
  imports: [HttpModule],
  controllers: [
    AppController,
    LoginController,
    UsersController,
    VideosController
  ],
  providers: [
    AppService,
    LoginService,
    RandomWordsService,
    UsersService,
    VideosService,
    TagsService
  ],
})
export class AppModule {}