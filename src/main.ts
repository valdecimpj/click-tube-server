import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized : true,
      proxy: true,
      name: 'click-tube-server',
      cookie: {
        secure: true,
        httpOnly: false,
        sameSite: 'none'
      }
    })
  );
  app.enableCors({origin:["https://click-tube-client.herokuapp.com"], credentials:true});
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
