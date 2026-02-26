import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Movie Streaming Platform API')
    .setDescription('A movie streaming platform with subscriptions, reviews, and more')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const preferredPort = Number(process.env.PORT || 3000);
  const maxAttempts = 10;
  let activePort = preferredPort;

  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      await app.listen(activePort);
      console.log(`Server running on http://localhost:${activePort}`);
      console.log(`Swagger docs available at http://localhost:${activePort}/api`);
      return;
    } catch (error: any) {
      if (error?.code !== 'EADDRINUSE') {
        throw error;
      }
      activePort += 1;
    }
  }

  throw new Error(
    `No free port found. Tried from ${preferredPort} to ${preferredPort + maxAttempts - 1}.`,
  );
}
bootstrap();
