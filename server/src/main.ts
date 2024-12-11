import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

// Without import `import {ParserNode} from '~shared';` build will fail with error
import {ParserNode} from '~shared';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const parserNode = {} as ParserNode;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
}

bootstrap();
