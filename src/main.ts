import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './core/response.interceptor';

const docsEndpoint = '/api';
const title = process.env.MS_NAME ?? 'GESTIÓN DE COORDENADAS';
const descripcion = process.env.MS_DESCRIPTION ?? 'Microservicio de coordenadas del usuario';


function configureSwagger(app): void {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(title)
    .setDescription(descripcion)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsEndpoint, app, document);
}

async function bootstrap() {


  const app_port = process.env.HOST_PORT ? Number(process.env.HOST_PORT) : 3000;
  const ms_port_micro = process.env.MS_PORT_MICRO ? Number(process.env.MS_PORT_MICRO) : 3001;
  const host_name = process.env.HOST_NAME ? process.env.HOST_NAME : '0.0.0.0';

  const app = await NestFactory.create(AppModule);
  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: '*' });

  configureSwagger(app);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist:true,
    forbidNonWhitelisted:true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: host_name,
      port: ms_port_micro
    },
  });

  await app.startAllMicroservices();
  await app.listen(app_port);
  console.log(`Microservice listening INTERNAL${process.env.MS_NAME} on Enviroment:`, process.env.ENV);
  console.log(`Microservice listening INTERNAL${process.env.MS_NAME} name:`, process.env.MS_NAME);
  console.log(`Microservice listening INTERNAL${process.env.MS_NAME} on ports:`, app_port + ":" + ms_port_micro);
  console.log(`Microservice INTERNAL ${process.env.MS_NAME} is running on: ${await app.getUrl()}`);
}

bootstrap();