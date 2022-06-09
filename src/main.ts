import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'asdqwe ewqdsa',
      resave: false,
      saveUninitialized : false,
    })
  );
  app.enableCors({origin:["http://localhost:4200"], credentials:true});
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
