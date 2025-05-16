import dotenv from 'dotenv';
import fastify from 'fastify';
import connectDB from './models/db';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

import { forecastRoutes } from '../app/routers/forecast.routes';

dotenv.config();

const app = fastify({ logger: true });

app.register(swagger, {
  swagger: {
    info: {
      title: 'Microgrid Forecast API',
      description: 'API documentation for the Microgrid Forecast service',
      version: '1.0.0'
    },
    host: 'localhost:3001',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  }
});

app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  }
});

app.register(forecastRoutes, { prefix: '/api' });

const start = async () => {
    try{
      connectDB();
      app.register(require('@fastify/cors'), {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      });
    await app.listen({ port: 3001 });
    const address = app.server.address();
    if (typeof address === 'string') {
        app.log.info(`Server listening on ${address}`);
    } else if (address && typeof address === 'object') {
        app.log.info(`Server listening on port ${address.port}`);
    } else {
        app.log.info('Server listening on unknown address');
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
