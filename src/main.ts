import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const optionCors = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  };
  app.enableCors(optionCors);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      skipMissingProperties: false,
      exceptionFactory: (errors) => {
        return new HttpException(
          {
            success: false,
            error: Object.values(errors[0].constraints)[0],
          },
          HttpStatus.OK,
        );
      },
      whitelist: false,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('SudoTech Nest API')
    .addBearerAuth()
    .setDescription('The Nest core API description')
    .setVersion('1.0')
    .addTag('dummy')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/api-document', app, document);

  await app.listen(3000);
}
bootstrap();
