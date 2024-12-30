import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  console.log('=== 서버 시작 ===');
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정 수정
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://172.31.26.67:3000'  // 내부망 IP 추가
    ],
    credentials: true,
  });
  
  // JSON 요청 크기 제한 증가
  app.use(json({ limit: '50mb' }));
  // URL-encoded 요청 크기 제한 증가
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`
=== 서버 준비 완료 ===
- URL: http://localhost:${port}
- CORS: enabled
- 환경: ${process.env.NODE_ENV || 'development'}
  `);
}
bootstrap(); 