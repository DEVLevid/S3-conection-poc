import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter, AllExceptionsFilter } from '../src/common/filters';
import { ResponseInterceptor } from '../src/common/interceptors';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same configuration as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new HttpExceptionFilter(),
    );

    app.useGlobalInterceptors(new ResponseInterceptor());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data', 'Hello World!');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('/api/v1/files (GET) - should return empty files list', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/files')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
    expect(response.body).toHaveProperty('pagination');
    expect(response.body.pagination.total).toBe(0);
  });

  it('/api/v1/files/invalid-uuid (GET) - should return 400 for invalid UUID', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/files/invalid-uuid')
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
  });
});
