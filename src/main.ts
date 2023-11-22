import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './utils/logger-service';

// load env file
import dotenv = require('dotenv');
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new LoggerService(),
    });
    app.enableCors();
    await app.listen(process.env.PORT || 8080);
    console.log(`service is running: ${process.env.PORT || 8080}`);
}
bootstrap();
